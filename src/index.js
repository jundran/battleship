import Player from './factories/player.js'
import { drawGrid, placeMode } from './gameboardDom.js'
export let player
export let computer
let gameRunning = false
const ocean = new Audio('src/assets/ocean.mp3')
const music = new Audio('src/assets/fall-from-grace.mp3')
music.loop = true
music.volume = .5
musicOn(true) // if auto play enabled
document.querySelector('.sound').addEventListener('click', toggleMusic)
document.querySelector('.play-again').addEventListener('click', restart)
game()

async function musicOn (on, reset = false) {
	if (reset) music.currentTime = 0
	const soundIcon = document.querySelector('.sound')
	if (on) {
		music.play()
			.then(() => soundIcon.src = 'src/assets/sound.svg')
			.catch(() => soundIcon.src = 'src/assets/mute.svg')
	}
	else {
		music.pause()
		soundIcon.src = 'src/assets/mute.svg'
	}
}

function toggleMusic () {
	if (music.paused) musicOn(true)
	else musicOn(false)
}

export function setMessage (message, info) {
	document.querySelector('.message h2').textContent = message
	if (info !== undefined) document.querySelector('.info').textContent = info
}

export function gameOver (winner) {
	gameRunning = false
	const loser = winner.isComputer ? player : computer
	setMessage(`${winner.name} is victorious! ${loser.name} has no more ships remaining.`)
	ocean.pause()
	if (music.paused) musicOn(true, true)
}

function restart () {
	if (gameRunning) music.currentTime = 0
	gameRunning = false
	ocean.pause()
	musicOn(true)
	game()
}

function isRoundInProgress () {
	return gameRunning && !computer.board.enabled
}

async function game () {
	if (isRoundInProgress()) location.reload()

	// Set up computer
	computer = Player('Computer', true)
	computer.board.populateShips()
	drawGrid(computer.board, document.querySelector('.computer-grid'), true)

	// Set up player
	player = Player('Player')
	drawGrid(player.board, document.querySelector('.player-grid'))
	setMessage('Place your carrier', 'Right click to change axis')
	await placeMode('carrier', 5, player.board)
	setMessage('Place your battleship')
	await placeMode('battleship', 4, player.board)
	setMessage('Place your destroyer')
	await placeMode('destroyer', 3, player.board)
	setMessage('Place your submarine')
	await placeMode('submarine', 3, player.board)
	setMessage('Place your patrol boat')
	await placeMode('patrolBoat', 2, player.board)

	// Start game
	setMessage('Ready to play', 'Select a target square in enemy waters')
	musicOn(false)
	ocean.currentTime = 0
	ocean.loop = true
	ocean.volume = .5
	ocean.play()
	computer.board.enable()
	gameRunning = true
}
