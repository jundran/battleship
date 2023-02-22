import Ship from './ship.js'
import getTargetForComputer from '../computer.js'
export default function Gameboard (size) {
	const ships = []
	let isEnabled = false

	let board = []
	for (let x = 0; x < size; x++) {
		board.push([])
		for (let y = 0; y < size; y++) {
			board[x].push({ x, y, ship: null, hit: null })
		}
	}

	function addShip (type, squares) {
		const ship = Ship(type)
		ships.push(ship)
		for (const square of squares) {
			const [x, y] = square
			board[x][y].ship = ship
		}
	}

	function receiveAttack (x, y) {
		if (board[x][y].hit) return null // cannot hit already bombed cell
		board[x][y].hit = true
		if (board[x][y].ship) {
			board[x][y].ship.hit()
			if (board[x][y].ship.sunk) {
				ships.splice(ships.findIndex(ship => ship.name === board[x][y].ship.name), 1)
			}
			return true // hit
		}
		return false // miss
	}

	function getRandomInBounds (length, check) {
		const random = Math.floor(Math.random() * 10)
		if (check && random > 10 - length) return null
		else return random
	}

	function getShipArray (length, axis) {
		let x, y
		while (!x) x = getRandomInBounds(length, axis === 'x')
		while (!y) y = getRandomInBounds(length, axis === 'y')
		if (board[x][y].ship) return getShipArray(length, axis)

		const squares = [[x, y]]
		for (let i = 1; i < length; i++) {
			const next = axis === 'x' ? board[x + i][y] : board[x][y + i]
			if (next.ship) return getShipArray(length, axis)
			else squares.push([next.x, next.y])
		}
		return squares
	}

	function getRandomAxis () {
		if (Math.floor(Math.random() * 10) < 5) return 'x'
		else return 'y'
	}

	function populateShips () {
		addShip('carrier', getShipArray(5, getRandomAxis()))
		addShip('battleship', getShipArray(4, getRandomAxis()))
		addShip('destroyer', getShipArray(3, getRandomAxis()))
		addShip('submarine', getShipArray(3, getRandomAxis()))
		addShip('patrolBoat', getShipArray(2, getRandomAxis()))
	}

	return {
		get grid () { return board },
		get size () { return size },
		get ships () { return ships },
		get enabled () { return isEnabled },
		receiveAttack,
		getTargetSquare () { return getTargetForComputer(this) },
		addShip,
		populateShips,
		enable: () => isEnabled = true,
		disable: () => isEnabled = false
	}
}
