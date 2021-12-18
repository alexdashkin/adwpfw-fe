const $ = jQuery;

let disabled = false;

const defaults = {
	selector: null, // string
	action: null, // string
	nonce: null, // string
	data: null, // callback
	validator: null, // callback
	callback: null, // response handler callback
	callbackArgs: {},
	texts: {
		// normal: 'Do',
		processing: 'Processing...',
		success: 'Done',
		error: 'Error',
	}
};

const handleResponse = (response, $button, opts) => {
	disabled = false;

	const text = response.success ? opts.texts.success : opts.texts.error;
	const css = response.success ? 'updated-message' : 'error';

	$button.removeClass('updating-message').addClass(css).html(text);
	setTimeout(() => $button.removeClass(css).html(opts.texts.normal), 2000);

	if (opts.callback) {
		opts.callback(response);
	}
}

export default opts => {
	opts.texts = {...defaults.texts, ...opts.texts};
	opts = {...defaults, ...opts};

	$(opts.selector).on('click', function (e) {
		e.preventDefault();

		if (disabled || (opts.validator && !opts.validator(this))) {
			return;
		}

		const $button = $(this);
		const texts = opts.texts;
		const data = opts.data ? opts.data(this) : {};

		texts.normal = texts.normal ? texts.normal : $button.html();
		$button.addClass('updating-message').html(texts.processing);

		const ajaxData = {
			url: window.ajaxurl,
			method: 'post',
			data: {
				action: opts.action ? opts.action : $button.data('action'),
				nonce: opts.nonce,
				...data,
			}
		}

		disabled = true;

		$.ajax(ajaxData)
			.done(response => handleResponse(response, $button, opts))
			.fail((jqXHR, textStatus, errorThrown) => handleResponse({success: false, message: errorThrown}, $button, opts));
	});
}
