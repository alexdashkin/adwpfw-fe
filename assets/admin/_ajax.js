const $ = jQuery;

export default class {

	constructor(opts) {
		const defaults = {
			prefix: '',
			nonce: '',
			ajaxOpts: {
				method: 'POST',
				url: ajaxurl,
			},
		};

		this.opts = Object.assign(defaults, opts);
	}

	run(args) {
		const ajaxOpts = this.opts.ajaxOpts;

		ajaxOpts.data = {
			action: this.opts.prefix + '_' + args.action,
			_wpnonce: this.opts.nonce,
			data: args.data,
		};

		return $.ajax(ajaxOpts);
	}
}