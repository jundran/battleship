import Gameboard from './gameboard.js'
export default function Player (name, isComputer = false) {
	let gameboard = Gameboard(10)

	return {
		get board () { return gameboard },
		get name () { return name },
		get isComputer () { return isComputer }
	}
}
