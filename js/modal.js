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

let back = document.querySelector("#addEmail")
let modal = document.querySelector(".container")

modal.addEventListener("click", (evt) => {
	evt.stopPropagation()
})

back.addEventListener("click", () => {
	hideModal()
})

function showModal() {
	back.classList.remove("hide")
}

function hideModal() {
	console.log(back)
	back.classList.add("hide")
	console.log("hide")
}
