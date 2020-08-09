/**
 * Logger
 */
export default class {
	constructor(enabled = true, prefix = 'Adwpfw: ', color = 'blue') {
		this.enabled = enabled;
		this.prefix = prefix;
		this.color = color;
	}

	log(message, prefix = '', color = '') {
		prefix = prefix ? prefix : this.prefix;
		color = color ? color : this.color;

		if (this.enabled) {
			console.log('%c' + prefix + message, 'color: ' + color + '; font-weight: bold');
		}

		return null;
	}
}
