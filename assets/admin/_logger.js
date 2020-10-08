export default class {
	constructor(opts) {
		const defaults = {
			enabled: true,
			prefix: '',
			color: 'blue'
		};

		this.opts = Object.assign(defaults, opts);
	}

	log(message, prefix = '', color = '') {
		if (!this.opts.enabled) {
			return null;
		}

		prefix = prefix ? prefix : this.opts.prefix;
		color = color ? color : this.opts.color;

		const date = `[${new Date().toISOString().split('T')[1].slice(0, -1)}] `;
		console.log(`%c${date}${prefix}${message}`, `color: ${color}; font-weight: bold`);

		return null;
	}
}
