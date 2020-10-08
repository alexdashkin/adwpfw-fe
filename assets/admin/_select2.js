import 'select2';

const $ = jQuery;

export default class {

	constructor(opts) {
		const defaults = {
			selector: '.' + opts.prefix + ' .adwpfw-select2',
		};

		this.opts = Object.assign(defaults, opts);

		this.run();
	}

	run() {
		const _this = this;

		$(this.opts.selector).each(function () {
			const $select2 = $(this);

			// Avoid applying select2 twice
			if ($select2.hasClass('select2-hidden-accessible')) {
				return;
			}

			const select2Options = {
				width: '100%',
				multiple: $select2.prop('multiple'),
				placeholder: $select2.data('placeholder'),
				minimumInputLength: $select2.data('minChars'),
			};

			if ($select2.data('ajaxAction')) {
				const action = $select2.data('ajaxAction');

				select2Options.ajax = {
					url: ajaxurl,
					method: 'post',
					delay: 200,

					data(params) {
						return {
							action: _this.opts.prefix + '_' + action,
							_wpnonce: _this.opts.nonce,
							data: {
								q: params.term
							}
						}
					},

					processResults(data) {
						return {
							results: data.data
						};
					}
				}
			} else {
				select2Options.minimumResultsForSearch = $select2.data('minItemsForSearch');
			}

			$select2.select2(select2Options);
		});
	}
}