let wrapper = document.querySelector("#wrapperProfessores")
let busca = document.getElementById("inputBusca")
let reset = document.getElementById("resetButton")
var url = new URL(window.location)
var nome = url.searchParams.get("nome")

if(nome){
	buscar(nome)
}

wrapper.children[0].remove()
getEmails()

busca.addEventListener("input", (e) => {
	for (const professor of wrapper.children) {
		if (
			professor
				.getAttribute("professorname")
				.toString()
				.search(replaceSpecialChars(busca.value).toLowerCase()) == -1
		) {
			professor.classList.add("sumir")
		} else {
			if (
				e.inputType == "deleteContentBackward" ||
				e.inputType == "deleteWordBackward"
			) {
				professor.classList.remove("sumir")
			}
		}
	}
	if (!busca.value) {
		reset.classList.add("resetHidden")
	} else {
		reset.classList.remove("resetHidden")
	}
})

reset.addEventListener("click", () => {
	reset.classList.add("resetRotate")
	busca.value = ""
	for (const professor of wrapper.children) {
		professor.classList.remove("sumir")
	}
	setTimeout(() => {
		reset.classList.remove("resetRotate")
		reset.classList.add("resetHidden")
	}, 800)
})

function getEmails() {
	fetch("./emails.json")
		.then((Response) => Response.json())
		.then((data) => {
			var professoresOrdenados = []
			for (const prof in data) {
				professoresOrdenados.push({
					nome: prof,
					email: data[prof].email,
					nota: data[prof].nota,
					materias: data[prof].materias,
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
				let card = criaCard(
					prof.nome,
					prof.email,
					prof.nota,
					prof.materias
				)
				wrapper.appendChild(card)
			}
		})
}

function criaCard(nome, email, nota, materias) {
	let professor = document.createElement("div")
	professor.classList.add("professor")
	professor.setAttribute(
		"professorName",
		replaceSpecialChars(nome).toLowerCase()
	)
	let title = document.createElement("div")
	title.classList.add("title")
	let arrow = document.createElement("i")
	arrow.classList.add("fas", "fa-chevron-right")
	let professorName = document.createElement("h3")

	let description = document.createElement("div")
	description.classList.add("description")

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

	if (nota) {
		preferencia.appendChild(estrela)
		preferencia.appendChild(votacao)
		description.appendChild(preferencia)
	}

	professor.appendChild(title)
	professor.appendChild(description)

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

async function buscar(name){
	await sleep(500)
	busca.value = name
	for (const professor of wrapper.children) {
		if (
			professor
				.getAttribute("professorname")
				.toString()
				.search(replaceSpecialChars(busca.value).toLowerCase()) == -1
		) {
			professor.classList.add("sumir")
		} 
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}