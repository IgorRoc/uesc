let wrapper = document.querySelector("#wrapperProfessores")
let loadingState = document.querySelector("#loadingState")
let busca = document.getElementById("inputBusca")
var url = new URL(window.location)
var nome =
	url.searchParams.get("nome") ||
	url.searchParams.get("search") ||
	url.searchParams.get("nick") ||
	url.searchParams.get("s") ||
	url.searchParams.get("v")
let filtros = ["CIC", "DIR"]

getEmails()

busca.addEventListener("input", (e) => {
	buscar(busca.value)
})

async function getEmails() {
	// fake delay to show loading
	await sleep(2000)
	await fetch("../emails/emails.json")
		.then((Response) => Response.json())
		.then((data) => {
			var professoresOrdenados = []
			for (const prof in data) {
				professoresOrdenados.push({
					nome: prof,
					email: data[prof].email,
					nota: data[prof].nota,
					apelido: data[prof].apelido,
					imagem: data[prof].imagem,
					curso: data[prof].curso,
				})
			}
			professoresOrdenados.sort(function (a, b) {
				let nomeA = replaceSpecialChars(a.nome)
				let nomeB = replaceSpecialChars(b.nome)
				if (nomeA > nomeB) {
					return 1
				}
				if (nomeA < nomeB) {
					return -1
				}
				return 0
			})

			for (const prof of professoresOrdenados) {
				let card = criaCard(prof)
				wrapper.appendChild(card)
			}
		})
		.then(() => {
			if (nome) {
				sleep(100).then(() => {
					buscar(nome)
				})
			}
		})
		.then(() => {
			loadingState.remove()
		})
}

function criaCard({ nome, email, nota, apelido, imagem, curso }) {
	let professor = document.createElement("div")
	professor.classList.add("professor")
	professor.setAttribute("prof_name", replaceSpecialChars(nome).toLowerCase())
	if (apelido) {
		professor.setAttribute("prof_nickname", replaceSpecialChars(apelido).toLowerCase())
	}
	if (curso) {
		professor.setAttribute("prof_curso", curso)
	}
	let title = document.createElement("div")
	title.classList.add("title")
	let arrow = document.createElement("i")
	arrow.classList.add("fas", "fa-chevron-right")
	let professorName = document.createElement("h3")

	let description = document.createElement("div")
	description.classList.add("description")

	let image = document.createElement("div")
	image.classList.add("imagem")
	let imgSrc = document.createElement("img")
	imgSrc.src = imagem
	let showImage = true

	imgSrc.onerror = (e) => {
		showImage = false
		image = null
		imgSrc = null
	}

	let preferencia = document.createElement("div")
	preferencia.classList.add("preferencia")
	let estrela = document.createElement("i")
	estrela.classList.add("fas", "fa-star")
	let votacao = document.createElement("p")

	professorName.innerText = nome

	votacao.innerText = `${nota}/5`

	title.appendChild(arrow)
	title.appendChild(professorName)

	if (email) {
		if (typeof email === "object") {
			email.forEach((e) => {
				let mail = document.createElement("div")
				mail.classList.add("mail")
				let envelope = document.createElement("i")
				envelope.classList.add("fas", "fa-envelope")
				let link = document.createElement("a")

				link.href = `mailto:${e}`
				link.innerText = e

				mail.appendChild(envelope)
				mail.appendChild(link)
				description.appendChild(mail)
			})
		} else {
			let mail = document.createElement("div")
			mail.classList.add("mail")
			let envelope = document.createElement("i")
			envelope.classList.add("fas", "fa-envelope")
			let link = document.createElement("a")

			link.href = `mailto:${email}`
			link.innerText = email

			mail.appendChild(envelope)
			mail.appendChild(link)
			description.appendChild(mail)
		}
	}

	// if (nota) {
	// 	preferencia.appendChild(estrela)
	// 	preferencia.appendChild(votacao)
	// 	description.appendChild(preferencia)
	// }

	professor.appendChild(title)
	professor.appendChild(description)

	if (showImage && imagem) {
		image.appendChild(imgSrc)
		professor.appendChild(image)
	}

	return professor
}

function replaceSpecialChars(str) {
	str = str.replace(/[ÀÁÂÃÄÅ]/, "A")
	str = str.replace(/[àáâãäå]/, "a")
	str = str.replace(/[ÈÉÊË]/, "E")
	str = str.replace(/[èéê]/, "e")
	str = str.replace(/[ÌÍÎ]/, "I")
	str = str.replace(/[ìíî]/, "i")
	str = str.replace(/[ÒÓÔÕ]/, "O")
	str = str.replace(/[òóôõ]/, "o")
	str = str.replace(/[ÙÚÛ]/, "U")
	str = str.replace(/[ùúû]/, "u")
	str = str.replace(/[Ç]/, "C")
	str = str.replace(/[ç]/, "c")

	return str
}

function buscar(name) {
	busca.value = name
	for (const professor of wrapper.children) {
		if (professor.getAttribute("prof_nickname")) {
			if (
				professor
					.getAttribute("prof_name")
					.toString()
					.search(replaceSpecialChars(busca.value).toLowerCase()) == -1 &&
				professor
					.getAttribute("prof_nickname")
					.toString()
					.search(replaceSpecialChars(busca.value).toLowerCase()) == -1
			) {
				professor.classList.add("sumir")
			} else {
				professor.classList.remove("sumir")
			}
		} else if (
			professor
				.getAttribute("prof_name")
				.toString()
				.search(replaceSpecialChars(busca.value).toLowerCase()) == -1
		) {
			professor.classList.add("sumir")
		} else {
			professor.classList.remove("sumir")
		}
	}
}

function filtrar() {
	let filtrosElement = document.querySelectorAll("#filterForm input")

	filtros = []

	filtrosElement.forEach((filtro) => {
		if (filtro.checked) {
			filtros.push(filtro.value)
		}
	})

	for (const professor of wrapper.children) {
		if (filtros.length > 0) {
			if (filtros.includes(professor.getAttribute("prof_curso"))) {
				professor.classList.remove("sumir")
			} else {
				professor.classList.add("sumir")
			}
		} else {
			professor.classList.remove("sumir")
		}
	}

	hideModalFilter()
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
