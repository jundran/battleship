const targetHistory = []
let target = null
let direction = ['north', 'east', 'south', 'west'][Math.floor(Math.random() * 4)]

// Algorithm to get a target square on the player's board that the computer can shoot at.
export default function getTargetSquare (board, passedInTarget, passedInDirection) {
	const lastTarget = targetHistory[targetHistory.length - 1]

	// Always use passed in target as current target if defined
	if (passedInTarget) {
		target = passedInTarget
		direction = passedInDirection
	}
	// Clear current target if ship has been sunk
	else if (target && target.ship && target.ship.sunk) {
		const nextShip = searchForPreviouslyHitButUnsunkShip()
		if (nextShip) return getTargetSquare(board, nextShip, direction)
		target = null
		direction = 'west'
	}
	// Last missile launch hit an unsunk ship so try and find the rest of it
	else if (!target && lastTarget && lastTarget.ship && !lastTarget.ship.sunk) {
		target = lastTarget
	}

	// Used when two ships are adjacent and another is found while trying to sink the first.
	// The flaw in the computer's logic here is that when it starts trying to sink this ship,
	// it has not remembered which direction was previously successful but will still sink
	// it with, at most, one missed shot in an unplayed direction.
	function searchForPreviouslyHitButUnsunkShip () {
		return targetHistory.reverse().find(square => square.hit && square.ship && !square.ship.sunk)
	}

	function getNextDirection (direction) {
		switch (direction) {
		case 'west'	:	return 'east'
		case 'east'	:	return 'north'
		case 'north':	return 'south'
		default			:	return 'west'
		}
	}

	function getResult (x, y) {
		targetHistory.push(board.grid[x][y])
		return [x, y]
	}

	function getNextSquare (direction, check, x, y) {
		if (check) {
			let square = board.grid[x][y]
			// Next square is already hit but is current ship so keep going until miss
			if (square.hit && square.ship && !square.ship.sunk) {
				return getTargetSquare(board, square, direction)
			}
			// Next square is already hit but it didn't hit the current ship so change direction
			else if (square.hit) {
				return getTargetSquare(board, target, getNextDirection(direction))
			}
			// Square has not yet been played so return it as the target
			return getResult(square.x, square.y)
		}
		// Check failed (out of bounds) so change direction
		return getTargetSquare(board, target, getNextDirection(direction))
	}

	if (target) { // Find logical square to play
		if (direction === 'west') {
			return getNextSquare('west', target.y > 0, target.x, target.y - 1)
		}
		else if (direction === 'east') {
			return getNextSquare('east', target.y < 9, target.x, target.y + 1)
		}
		else if (direction === 'north') {
			return getNextSquare('north', target.x > 0, target.x - 1, target.y)
		}
		else if (direction === 'south') {
			return getNextSquare('south', target.x < 9, target.x + 1, target.y)
		}
	} else { // Play random square
		const x = Math.floor(Math.random() * board.size)
		const y = Math.floor(Math.random() * board.size)
		if (board.grid[x][y].hit) return getTargetSquare(board)
		return getResult(x, y)
	}
}
