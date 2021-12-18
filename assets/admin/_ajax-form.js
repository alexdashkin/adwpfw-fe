const $ = jQuery;

let disabled = false;
let options = {};

const defaults = {
	selector: null, // string
	action: null, // string
	nonce: null, // string
	validator: null, // callback
	callback: null, // response handler callback
	callbackArgs: {},
	texts: {
		normal: 'Do',
		processing: 'Processing...',
		success: 'Done',
		error: 'Error',
	}
};

const handleResponse = (response, $button) => {
	disabled = false;

	const text = response.success ? options.texts.success : options.texts.error;
	const css = response.success ? 'updated-message' : 'error';

	$button.removeClass('updating-message').addClass(css).html(text);
	setTimeout(() => $button.removeClass(css).html(options.texts.normal), 2000);

	if (options.callback) {
		options.callback(response);
	}
}

export default opts => {
	options = {...defaults, ...opts};

	$(options.selector).on('submit', function (e) {
		e.preventDefault();

		if (disabled || (options.validator && !options.validator(this))) {
			return;
		}

		const $form = $(this);
		const $button = $form.find('button[type="submit"]');
		const texts = options.texts;

		texts.normal = texts.normal ? texts.normal : $button.html();
		$button.addClass('updating-message').html(texts.processing);

		const ajaxData = {
			url: window.ajaxurl,
			method: 'post',
			data: {
				action: opts.action ? opts.action : $form.data('action'),
				nonce: options.nonce,
				form: $form.serialize(),
			}
		}

		disabled = true;

		$.ajax(ajaxData)
			.done(response => handleResponse(response, $button))
			.fail((jqXHR, textStatus, errorThrown) => handleResponse({success: false, message: errorThrown}, $button));
	});
}
