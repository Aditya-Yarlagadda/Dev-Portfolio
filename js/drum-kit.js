const sounds = {
	w: "./Assets/Sound/tom-1.mp3",
	a: "./Assets/Sound/tom-2.mp3",
	s: "./Assets/Sound/tom-3.mp3",
	d: "./Assets/Sound/tom-4.mp3",
	j: "./Assets/Sound/snare.mp3",
	k: "./Assets/Sound/crash.mp3",
	l: "./Assets/Sound/kick-bass.mp3",
};

document.querySelectorAll(".drum").forEach((el) => {
	el.addEventListener("click", handleClick);
});

document.addEventListener("keydown", e => {
	if (!Object.keys(sounds).includes(e.key)) {
		return;
	}
	const file = sounds[e.key];
	const sound = new Audio(file);
	sound.play();
	buttonAnimation(e.key);
});

function handleClick() {
	const file = sounds[this.textContent.trim()];
	const sound = new Audio(file);
	sound.play();
	buttonAnimation(this.textContent.trim());
}

function buttonAnimation(currentKey) {
	let pressedKey = document.querySelector(`.${currentKey}`)
	pressedKey.classList.add("pressed")
	setTimeout(function() {
		pressedKey.classList.remove("pressed")
	}, 100)
}
