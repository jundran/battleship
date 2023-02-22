/* eslint-disable no-undef */
import Ship from '../ship.js'

let ship
beforeEach(() => ship = Ship('carrier'))

test('Ship returns correct name', () => {
	expect(ship.name).toBe('carrier')
})

test('Ship returns correct id', () => {
	expect(ship.id).toBe(5)
})

test('Ship returns correct length', () => {
	expect(ship.length).toBe(5)
})

test('Ship returns correct number of hits', () => {
	ship.hit()
	ship.hit()
	expect(ship.numHits).toBe(2)
})

test('Ship is sunk after hits === length', () => {
	ship.hit()
	ship.hit()
	ship.hit()
	ship.hit()
	ship.hit()
	expect(ship.sunk).toBe(true)
})
