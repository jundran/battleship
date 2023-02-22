/* eslint-disable no-undef */
import Player from '../player.js'

describe('Human player', () => {
	let player
	beforeEach(() => player = Player('Player'))

	test('Player returns correct name', () => {
		expect(player.name).toBe('Player')
	})

	test('Player is not computer', () => {
		expect(player.isComputer).toBe(false)
	})
})

describe('Computer player', () => {
	let computer
	test('Computer returns correct name', () => {
		expect(computer.name).toBe('Computer')
	})

	beforeEach(() => computer = Player('Computer', true))

	test('Computer is computer', () => {
		expect(computer.isComputer).toBe(true)
	})
})
