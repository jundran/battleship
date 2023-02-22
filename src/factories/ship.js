export default function Ship (type) {
	const CLASS = {
		carrier: {
			name: 'carrier',
			id: 5,
			length: 5
		},
		battleship: {
			name: 'battleship',
			id: 4,
			length: 4
		},
		destroyer: {
			name: 'destroyer',
			id: 3,
			length: 3
		},
		submarine: {
			name: 'submarine',
			id: 2,
			length: 3
		},
		patrolBoat: {
			name: 'patrol boat',
			id: 1,
			length: 2
		}
	}
	let hits = 0

	return {
		get name () { return CLASS[type].name},
		get id () { return CLASS[type].id },
		get length () { return CLASS[type].length },
		get numHits () { return hits },
		get sunk () { return hits === this.length },
		hit () { return ++hits }
	}
}
