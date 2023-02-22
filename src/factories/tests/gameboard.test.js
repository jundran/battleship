/* eslint-disable no-undef */
import Gameboard from '../gameboard.js'

let gameboard
beforeAll(() => {
	gameboard = Gameboard(10)
})

test('Get random square', () => {
	expect(gameboard.getTargetSquare()).toHaveLength(2)
})

test('Disable gameboard', () => {
	gameboard.disable()
	expect(gameboard.enabled).toBe(false)
})

test('Enable gameboard', () => {
	gameboard.enable()
	expect(gameboard.enabled).toBe(true)
})

test('Fire into empty water', () => {
	expect(gameboard.receiveAttack(0,0)).toBe(false)
})

test('Place ship and fire at it', () => {
	gameboard.addShip('carrier', [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5]])
	expect(gameboard.receiveAttack(1, 2)).toBe(true)
})

test('Cannot attack same square twice', () => {
	expect(gameboard.receiveAttack(1, 2)).toBe(null)
})
