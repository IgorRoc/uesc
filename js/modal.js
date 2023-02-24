let inputs = document.querySelectorAll(".input input")

inputs.forEach((input) => {
	input.addEventListener("focus", () => {
		input.parentNode.classList.add("active")
	})

	input.addEventListener("blur", () => {
		if (input.value === "") {
			input.parentNode.classList.remove("active")
		}
	})
})

let backEmail = document.querySelector("#addEmail")
let backFilter = document.querySelector("#filter")
let modalEmail = document.querySelector("#addEmail .container")
let modalFilter = document.querySelector("#filter .container")

modalEmail.addEventListener("click", (evt) => {
	evt.stopPropagation()
})

backEmail.addEventListener("click", () => {
	hideModalEmail()
})

function showModalEmail() {
	backEmail.classList.remove("hide")
}

function hideModalEmail() {
	backEmail.classList.add("hide")
}

function showModalFilter() {
	backFilter.classList.remove("hide")
}

function hideModalFilter() {
	backFilter.classList.add("hide")
}
