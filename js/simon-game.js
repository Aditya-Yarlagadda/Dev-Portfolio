/** @type {(s: string) => HTMLElement} */
const $ = (s) => document.querySelector(s);
const colorList = ["red", "green", "blue", "yellow"];
var chosenColor = "";
var order = [];
var playerOrder = [];
var roundCount = 0;
var currentRound = 0;
var custom = $("#custom-rounds");
var currentAudio = null;

function shake(el) {
	el.classList.remove("is-shaking");
	void el.offsetWidth;
	el.classList.add("is-shaking");
}

function slideOut(el) {
	el.classList.add("is-sliding");
	$("body").classList.add("is-transitioning");
	el.addEventListener(
		"animationend",
		function () {
			el.classList.remove("is-sliding");
			el.classList.add("hidden");
			$("body").classList.remove("is-transitioning");
			$(".container").classList.remove("hidden");
		},
		{ once: true },
	);
}

function sameOrder(a, b) {
	return a.length === b.length && a.every((item, i) => item === b[i]); //checks if the lists contents are equal
}

function randomize() {
	var randomNum = Math.floor(Math.random() * 4);
	chosenColor = colorList[randomNum];
	order.push(chosenColor);
	var randomAudio = new Audio(`./Assets/sounds/${chosenColor}.mp3`);
	randomAudio.play();
	setTimeout(function () {
		$(`.${chosenColor}`).classList.add("glow");
		$("h1").innerHTML = "Click the glowing buttons in the correct order! Every round, you will have to memorize the order of one more.";
	}, 300);
	setTimeout(function () {
		document.querySelectorAll(".box").forEach((el) => {
			el.addEventListener("click", gameLogic);
		});
		$(`.${chosenColor}`).classList.remove("glow");
	}, 500);
}

function gameLogic(event) {
	//add the loop to checked something like if their list = list that the game has created up to a certain point let them pass else commit fail
	document.querySelectorAll(".box").forEach((el) => {
		el.removeEventListener("click", gameLogic);
	});
	playerOrder.push(event.target.id);
	let tempList = order.slice(0, playerOrder.length);
	let audio = new Audio("Assets/sounds/correct.mp3");
	if (sameOrder(playerOrder, order)) {
		playerOrder = [];
		audio.pause();
		audio.volume = 0.4;
		audio.currentTime = 0;
		audio.play()
		playGame(); //keeps the round going
	} else if (sameOrder(playerOrder, tempList)) {
		audio.pause();
		audio.volume = 0.4;
		audio.currentTime = 0;
		audio.play();
		document.querySelectorAll(".box").forEach((el) => {
			el.addEventListener("click", gameLogic);
		}); // reads the event listeners and waits
	} else {
		$("h1").innerHTML = "Game Over";
		audio = new Audio("Assets/sounds/wrong.mp3")
		audio.play()
		$("body").style.backgroundColor = "red";
		setTimeout(()=> {
			$("body").style.backgroundColor = "#011f3f";
		}, 500)
	}
}

function playGame() {
	if (currentRound === roundCount) {
		console.log("Game over");
		$("h1").innerHTML = "Game Over, You Win!";
		let audio = new Audio("Assets/sounds/winner.mp3")
		audio.volume = 0.5;
		audio.play()
		$("body").style.backgroundColor = "green"
		setTimeout(()=> {
			$("body").style.backgroundColor = "#011f3f";
		}, 1000)
		return;
	}
	currentRound += 1; // tells the game the current round count.
	$(".round-counter h2").innerHTML = `Round: ${currentRound}/${roundCount}`;
	randomize();
}

function rushOut(el) {
	el.classList.add("rush-out");
	$("body").classList.add("is-transitioning");
	$(".round-counter").addEventListener("animationend", function () {
		$(".round-counter").classList.remove("fade-in");
	});
	el.addEventListener("animationend", function () {
		el.classList.remove("rush-out");
		$("body").classList.remove("is-transitioning");
		$(".start-btn").classList.add("hidden");
		$(".round-counter").classList.remove("hidden");
		$(".round-counter").classList.add("fade-in");
		document.querySelectorAll(".box").forEach((box) => {
			box.style.width = "35vmin";
		});
		var gameMode = $("input[name='rounds']:checked");
		gameMode = gameMode.value;
		if (gameMode === "custom") {
			console.log(gameMode);
			console.log(Number(custom.value));
			roundCount = Number(custom.value);
			playGame();
		} else if (gameMode === "Infinite") {
			console.log(gameMode);
			$(".round-counter h2").innerHTML = "Round: 1/∞"
			// pass
		} else {
			console.log(Number(gameMode));
			roundCount = Number(gameMode); //sets the round count based on the option the player chose.
			playGame();
		}
	});
}

$("#custom-label").addEventListener("focusin", function () {
	$("#custom").checked = true;
});

custom.addEventListener("input", function (ev) {
	let value = ev.target.valueAsNumber;
	if (value < 0) {
		custom.value = 0;
		custom.setCustomValidity("Rounds must be 1 or above!");
		custom.reportValidity();
	} else if (value > 150) {
		custom.value = 150;
		custom.setCustomValidity("Rounds must be 150 or below!");
		custom.reportValidity();
	} else {
		custom.setCustomValidity("");
	}
});

$(".play").addEventListener("click", function () {
	let picked = $("input[name=rounds]:checked");
	if (picked === null) {
		shake($(".rounds"));
		$("h1").innerHTML = "Choose a Game Option";
		return;
	} else if (picked.value === "custom" && Number.isNaN(custom.valueAsNumber)) {
		shake(custom);
		custom.setCustomValidity("Invalid Entry! Please enter a postive number!");
		custom.reportValidity();
		setTimeout(function () {
			custom.setCustomValidity("");
		}, 3000);
		return;
	}
	slideOut($(".game-start"));
	$("h1").innerHTML = "Press Start";
});

$(".start-btn").addEventListener("click", function () {
	rushOut($(".start-btn"));
});
