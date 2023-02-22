module.exports = {
	presets: [['@babel/preset-env', {targets: {node: 'current'}}]]
}

// Babel config with cjs extension for transpiling ES6 modules to common JS - only for Jest tests
// Ignores "type": "module" in package.json
