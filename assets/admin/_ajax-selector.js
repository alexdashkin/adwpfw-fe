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
		normal: 'Do',
		processing: 'Processing...',
		success: 'Done',
		error: 'Error',
	}
};

export default opts => {
	const options = {...defaults, ...opts};

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

	$(options.selector).find('button').on('click', function (e) {
		e.preventDefault();

		if (disabled || (options.validator && !options.validator(this))) {
			return;
		}

		const $button = $(this);
		const action = $button.closest(options.selector).find('select').val();

		if (!action) {
			return;
		}

		const texts = options.texts;
		const data = options.data ? options.data(this) : {};

		texts.normal = texts.normal ? texts.normal : $button.html();
		$button.addClass('updating-message').html(texts.processing);

		const ajaxData = {
			url: window.ajaxurl,
			method: 'post',
			data: {
				action,
				nonce: options.nonce,
				...data,
			}
		}

		disabled = true;

		$.ajax(ajaxData)
			.done(response => handleResponse(response, $button))
			.fail((jqXHR, textStatus, errorThrown) => handleResponse({success: false, message: errorThrown}, $button));
	});
}
