import { setMessage, player, computer, gameOver } from './index.js'
let isHorizontal = true

// Prevent context menu from interfering with placing ships when using right click to rotate them
document.querySelectorAll('.grid')
	.forEach(grid => grid.addEventListener('contextmenu', e => e.preventDefault()))

export function drawGrid (board, domBoard, isComputer = false) {
	domBoard.innerHTML = ''
	for (let x = 0; x < board.size; x++) {
		for (let y = 0; y < board.size; y++) {
			const square = createDomSquare(board, x, y, isComputer)
			domBoard.append(square)
		}
	}
}

function createDomSquare (board, x, y, isComputerSquare) {
	const domSquare = document.createElement('div')
	domSquare.className = 'square'
	domSquare.dataset.x = x
	domSquare.dataset.y = y
	if (isComputerSquare) domSquare.addEventListener('click', handleClickSquare)

	if (board.grid[x][y].ship) {
		domSquare.classList.add('ship')
		if (!isComputerSquare) domSquare.classList.add('reveal')
		if (board.grid[x][y].ship.sunk) domSquare.classList.add('reveal')
	}

	if (board.grid[x][y].hit) {
		const hit = document.createElement('div')
		hit.className = 'hit'
		domSquare.removeEventListener('click', handleClickSquare)
		domSquare.classList.add('disabled') // cannot disable div like button
		domSquare.append(hit)
	}
	return domSquare
}

function attack (attacker, defender, x, y) {
	const testing = false
	const MISSILE_SOUND_LENGTH = testing ? 1 : 1200
	const HIT_SOUND_LENGTH = testing ? 1 : 2200
	const MISS_SOUND_LENGTH = testing ? 1 : 1500

	return new Promise(resolve => {
		const hit = defender.board.receiveAttack(x, y)
		const launch = new Audio('src/assets/launch.mp3')
		const hitSound = new Audio('src/assets/hit.mp3')
		const miss = new Audio('src/assets/miss.mp3')
		launch.play() // Sound is annnoying. Just allow time until hit.
		setMessage(`${attacker.name} fired into enemy waters.... `, '')
		// Wait for missile sound to complete
		setTimeout(() => {
			hit ? hitSound.play() : miss.play()
			const sunk = hit ? defender.board.grid[x][y].ship.sunk : false
			let message2 = `${attacker.name} missed.`
			if (sunk) message2 = `${attacker.name} sunk ${defender.name}'s ${defender.board.grid[x][y].ship.name}!`
			else if (hit) message2 = `${attacker.name} hit ${defender.name}'s ship!`
			setMessage(message2, '')
			drawGrid(
				attacker.isComputer ? player.board : computer.board,
				document.querySelector(attacker.isComputer ? '.player-grid' : '.computer-grid'),
				!attacker.isComputer
			)
			// Wait for hit or miss sound to finish
			setTimeout(() => resolve(), hit ? HIT_SOUND_LENGTH : MISS_SOUND_LENGTH)
		}, MISSILE_SOUND_LENGTH)
	})
}

async function handleClickSquare (e) {
	if (!computer.board.enabled) return
	computer.board.disable()

	// Player's turn
	const [x, y] = [e.target.dataset.x, e.target.dataset.y]
	await attack(player, computer, x, y)
	if (!computer.board.ships.length) return gameOver(player)

	// Computer's turn
	const [randomX, randomY] = player.board.getTargetSquare()
	await attack(computer, player, randomX, randomY)
	if (!player.board.ships.length) gameOver(computer)
	else computer.board.enable() // allow player to select another square
}

export async function placeMode (type, length, board) {
	return new Promise(resolve => {
		// Called after adding ship to rerender grid which will remove listeners and draw the ship
		function callback () {
			drawGrid(board, document.querySelector('.player-grid'))
			resolve()
		}

		document.querySelectorAll('.player-grid .square').forEach(square =>
			square.addEventListener('mouseover', e => {
				placeShip(e, type, length, board, callback)
			})
		)
	})
}

function placeShip (e, type, length, board, callback) {
	const x = parseInt(e.target.dataset.x)
	const y = parseInt(e.target.dataset.y)
	const axis = isHorizontal ? y : x

	// Remove existing listeners by cloning square
	// Attempts to call removeEventListener to avoid duplicates do not work
	const currentSquare = e.target.cloneNode(false)

	// Change axis listener
	currentSquare.addEventListener('mousedown', e => {
		if (e.button !== 2) return
		isHorizontal = !isHorizontal
		placeShip(e, type, length, board, callback)
	})

	// Re-add mouseover listener, but do it on mouseleave to avoid loop
	currentSquare.addEventListener('mouseleave', () =>
		currentSquare.addEventListener('mouseover', e =>
			placeShip(e, type, length, board, callback)
		)
	)

	// Replace the square after adding listeners
	e.target.replaceWith(currentSquare)

	// Clear highlighted squares
	document.querySelectorAll('.player-grid .square')
		.forEach(square => square.classList.remove('valid', 'invalid'))

	// Check if ship will fit on the map for given axis direction
	if (axis > 10 - length) return currentSquare.classList.add('invalid')

	// Get squares where carrier will be placed
	const squares = []
	for (let i = axis; i < axis + length; i++) {
		const square = isHorizontal ? board.grid[x][i] : board.grid[i][y]
		if (square.ship) return currentSquare.classList.add('invalid') // ship in the way
		squares.push(isHorizontal ? [x, i] : [i, y])
	}

	// Highlight squares on the grid
	squares.forEach(square => {
		const [x, y] = square
		document.querySelector(`.player-grid [data-x='${x}'][data-y='${y}']`).classList.add('valid')
	})

	// Add ship on left click
	currentSquare.addEventListener('click', () => {
		board.addShip(type, squares)
		callback()
	})
}
