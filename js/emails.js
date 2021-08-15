let wrapper = document.querySelector("#wrapperProfessores")
let busca = document.getElementById("inputBusca")
let reset = document.getElementById("resetButton")

function getEmails() {
	fetch("../emails.json")
		.then((Response) => Response.json())
		.then((data) => {
			// let professores = JSON.parse(data)
			// console.log(professores)
			for (const prof in data) {
				let card = criaCard(prof, data[prof])
				wrapper.appendChild(card)
			}
		})
}

function criaCard(nome, email) {
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
	let mail = document.createElement("div")
	mail.classList.add("mail")
	let envelope = document.createElement("i")
	envelope.classList.add("fas", "fa-envelope")
	let link = document.createElement("a")

	professorName.innerText = nome
	link.href = `mailto:${email}`
	link.innerText = email

	title.appendChild(arrow)
	title.appendChild(professorName)

	mail.appendChild(envelope)
	mail.appendChild(link)

	description.appendChild(mail)

	professor.appendChild(title)
	professor.appendChild(description)

	return professor
}

wrapper.children[0].remove()
getEmails()

busca.addEventListener("input", (e) => {
	for (const professor of wrapper.children) {
		if (
			professor
				.getAttribute("professorname")
				.toString()
				.search(busca.value.toLowerCase()) == -1
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
    if(!busca.value){
        reset.classList.add("resetHidden")
    }else{
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