const $ = jQuery;

export default class {

	constructor(opts) {
		const defaults = {
			selector: '.adwpfw.' + opts.prefix,
		};

		this.opts = Object.assign(defaults, opts);

		this.run();
	}

	run() {
		this.opts.ajax.addForms([{
			element: $(this.opts.selector).find('form.adwpfw-form'),
			action: 'save',
			texts: {
				normal: 'Save Changes',
				processing: 'Saving...',
				success: 'Saved',
			}
		}]);
	}
}