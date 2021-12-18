import 'select2';

const $ = jQuery;

let options = {};

const defaults = {
	selector: '.adwpfw-select2',
};

export default opts => {
	options = {...defaults, ...opts};

	$(options.selector).each(function () {
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
			select2Options.ajax = {
				url: window.ajaxurl,
				method: 'post',
				delay: 200,
				data: params => ({
					action: $select2.data('ajaxAction'),
					nonce: options.nonce,
					q: params.term,
				}),
				processResults: data => ({results: data.data})
			}
		} else {
			select2Options.minimumResultsForSearch = $select2.data('minItemsForSearch');
		}

		$select2.select2(select2Options);
	});
}
