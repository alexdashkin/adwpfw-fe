const $ = jQuery;

export default class {

	constructor(opts) {
		const defaults = {
			ajax: null, // Ajax object
			selector: null, // string
			action: null, // string
			data: null, // callback
			validator: null, // callback
			callback: null, // response handler callback
			callbackArgs: {},
			context: this,
			texts: {
				normal: 'Do',
				processing: 'Processing...',
				success: 'Done',
				error: 'Error',
			}
		};

		this.opts = Object.assign(defaults, opts);

		this.run();
	}

	run() {
		const _this = this;
		const opts = this.opts;

		$(opts.selector).find('button').on('click', function (e) {
			e.preventDefault();

			if (_this.disabled || (opts.validator && !opts.validator.call(opts.context, this))) {
				return;
			}

			const $button = $(this);
			const action = $button.closest(opts.selector).find('select').val();

			if (!action) {
				return;
			}

			const texts = opts.texts;

			texts.normal = texts.normal ? texts.normal : $button.html();
			$button.addClass('updating-message').html(texts.processing);

			const ajaxOpts = {
				action,
				data: opts.data ? opts.data.call(opts.context, this) : {},
			}

			_this.disabled = true;

			opts.ajax.run(ajaxOpts)
				.done(response => _this.handleResponse(response, $button))
				.fail((jqXHR, textStatus, errorThrown) => _this.handleResponse({success: false, message: errorThrown}, $button));
		});
	}

	handleResponse(response, $button) {
		this.disabled = false;

		const opts = this.opts;
		const text = response.success ? opts.texts.success : opts.texts.error;
		const css = response.success ? 'updated-message' : 'error';

		$button.removeClass('updating-message').addClass(css).html(text);
		setTimeout(() => $button.removeClass(css).html(opts.texts.normal), 2000);

		if (opts.callback) {
			opts.callback.call(opts.context, response);
		}
	}
}
