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
		const selector = this.opts.selector;
		const $form = $(selector);
		const slug = $form.data('slug');

		new AjaxForm({
			ajax: this.opts.ajax,
			selector,
			action: 'save_' + slug,
			texts: {
				normal: 'Save Changes',
				processing: 'Saving...',
				success: 'Saved',
			}
		});
	}
}