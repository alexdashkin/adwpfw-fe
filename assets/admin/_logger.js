/**
 * Logger
 */
export default class {
	constructor(enabled = true, prefix = '', color = 'black') {
		this.enabled = enabled;
		this.prefix = prefix;
		this.color = color;
	}

	log(message, prefix = '', color = '') {
		prefix = prefix ? prefix : this.prefix;
		color = color ? color : this.color;

		if (this.enabled) {
			const date = `[${new Date().toISOString().split('T')[1].slice(0, -1)}] `;
			console.log(`%c${date}${prefix}${message}`, `color: ${color}; font-weight: bold`);
		}

		return null;
	}
}
