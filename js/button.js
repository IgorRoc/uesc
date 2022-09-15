const buttons = document.querySelectorAll(".btn")

const createRipple = (e, button) => {
	const circle = document.createElement("div")
    
	let d = Math.max(e.currentTarget.clientWidth, e.currentTarget.clientHeight)
	circle.style.width = circle.style.height = d + "px"

	circle.style.left = e.clientX - e.currentTarget.offsetLeft - d / 2 + "px"
	circle.style.top = e.clientY - e.currentTarget.offsetTop - d / 2 + "px"

	circle.classList.add("ripple")
	e.currentTarget.appendChild(circle)

	setTimeout(() => {
		button.removeChild(circle)
	}, 1000)
}

buttons.forEach((button) => {
	button.addEventListener("click", (e) => createRipple(e, button))
})
