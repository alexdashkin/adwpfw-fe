import AjaxForm from './_ajax-form';

const $ = jQuery;

export default class {

	constructor(opts) {
		const defaults = {
			ajax: null, // Ajax object
			selector: 'form.adwpfw-form',
		};

		this.opts = Object.assign(defaults, opts);

		this.run();
	}

	run() {
		new AjaxForm({
			ajax: this.opts.ajax,
			selector: this.opts.selector,
			texts: {
				normal: 'Save Changes',
				processing: 'Saving...',
				success: 'Saved',
			}
		});
	}
}