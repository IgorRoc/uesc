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
	await sleep(500)
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
	let placeholder = document.createElement("div")

	let html = `
	<div class="professor"
	prof_name="${replaceSpecialChars(nome).toLowerCase()}"
	prof_nickname="${apelido ? replaceSpecialChars(apelido).toLowerCase() : ""}"
	prof_curso="${curso ? curso : ""}">
		<div class="title">
			<iconify-icon icon="material-symbols:chevron-right-rounded" class="arrow" width="24"></iconify-icon>
			<h3>${nome}</h3>
		</div>
		<div class="description">
			<div class="mail">
				<iconify-icon icon="mdi:email"></iconify-icon>
				${
					email
						? `<a href="mailto:${email}">${email}</a>`
						: `<span>Não encontrei o email dele(a)</span>`
				}
				
			</div>
			<!--
			<div class="mail">
				<iconify-icon icon="mdi:academic-cap"></iconify-icon>
				<span>${curso}</span>
			</div>
			-->
		</div>
		${
			imagem
				? `<div class="imagem">
		<img src="${imagem}" alt="Foto de ${nome}">
	</div>`
				: ""
		}
	</div>
	`

	placeholder.innerHTML = html

	return placeholder.firstElementChild
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
		console.log(professor)
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
