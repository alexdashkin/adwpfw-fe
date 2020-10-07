const $ = jQuery;

export default class {

	constructor(opts) {
		const defaults = {
			prefix: null,
			action: null,
			url: window.ajaxurl,
			data: {},
			button: null,
			buttons: $('button, .button'),
			nonce: null,
			callback: null,
			context: this,
			texts: {
				normal: 'Do',
				processing: 'Processing...',
				success: 'Done',
				error: 'Error',
			}
		};

		this.settings = Object.assign(defaults, opts);
		this.buttonsDisabled = false;
		this.config = opts.config;

		this.ajaxQueue = $({});
	}

	addSelectors(selectors) {
		const _this = this;

		selectors.forEach(selector => {
			const $button = selector.element.siblings('.button');

			$button.click(function (e) {
				e.preventDefault();

				if (_this.buttonsDisabled) {
					return;
				}

				const action = selector.element.val();

				if (!action) {
					return;
				}

				if (selector.validation && !selector.validation.call(selector.context ? selector.context : this, this)) {
					return;
				}

				const defaultTexts = {
					normal: 'Do',
					processing: 'Doing...',
					success: 'Done',
					error: 'Error',
				};

				selector.texts = Object.assign(defaultTexts, selector.texts);

				_this.buttonAjax({
					action: _this.config.prefix + '_' + action,
					data: selector.data ? selector.data.call(selector.context ? selector.context : this, this) : {},
					button: $(this),
					texts: selector.texts,
					callback: selector.callback,
					context: selector.context,
				});
			});
		});
	}

	addButtons(buttons) {
		const _this = this;

		buttons.forEach(button => {
			button.element.click(function (e) {
				e.preventDefault();

				if (_this.buttonsDisabled) {
					return;
				}

				if (button.validation && !button.validation.call(button.context ? button.context : this, this)) {
					return;
				}

				const defaultTexts = {
					normal: 'Do',
					processing: 'Processing...',
					success: 'Done',
					error: 'Error',
				};

				button.texts = Object.assign(defaultTexts, button.texts);

				_this.buttonAjax({
					action: _this.config.prefix + '_' + button.action,
					data: button.data ? button.data.call(button.context ? button.context : this, this) : {},
					button: $(this),
					texts: button.texts,
					callback: button.callback,
					context: button.context,
				});
			});
		});
	}

	addForms(forms) {
		const _this = this;

		forms.forEach(form => {
			form.element.submit(function (e) {
				e.preventDefault();
				if (_this.buttonsDisabled) return;

				const $this = $(this);
				const $button = $this.find('button[type="submit"]');

				const defaultTexts = {
					normal: 'Submit',
					processing: 'Submitting...',
					success: 'Done',
					error: 'Error',
				};

				form.texts = Object.assign(defaultTexts, form.texts);

				_this.buttonAjax({
					action: _this.config.prefix + '_' + form.action + '_' + $this.data('slug'),
					data: {form: $this.serialize()},
					button: $button,
					texts: form.texts,
					callback: form.callback,
					context: form.context,
				});
			});
		});
	}

	buttonAjax(args) {
		if (this.buttonsDisabled) {
			// this.log('Buttons Disabled');
			return;
		}

		const params = Object.assign(this.settings, args);

		if (params.button) {
			params.texts.normal = params.texts.normal ? params.texts.normal : params.button.html();
			params.button.addClass('updating-message').html(params.texts.processing);
		}

		const callbackArgs = Object.assign({
			button: params.button,
			texts: params.texts,
			callback: params.callback,
			context: params.context,
		}, params.callbackArgs);

		const ajaxOpts = {
			url: params.url,
			data: {
				action: params.action,
				_wpnonce: params.nonce,
				data: params.data,
			}
		};

		this.toggleButtons({buttons: params.buttons, state: 'disable'});

		this.run({
			ajaxOpts,
			callback: this.handleButtonAjaxResponse,
			callbackArgs,
			context: this,
		});
	}

	run(args) {
		const _this = this;

		const defaults = {
			parallel: true,
			ajaxOpts: {},
			data: {},
			callback: null,
			callbackArgs: {},
			context: this,
		};

		args = Object.assign(defaults, args);

		const data = Object.assign({_wpnonce: this.settings.nonce}, args.data);

		const ajaxOpts = Object.assign({
			method: 'post',
			url: this.settings.url,
			data,
		}, args.ajaxOpts);

		if (args.parallel) {
			$.ajax(ajaxOpts)
				.done(response => _this.handleAjaxResponse(response, args))
				.fail((jqXHR, textStatus, errorThrown) => _this.handleAjaxResponse({success: false, message: errorThrown}, args));

		} else {
			this.qajax(ajaxOpts)
				.done(response => _this.handleAjaxResponse(response, args))
				.fail((jqXHR, textStatus, errorThrown) => _this.handleAjaxResponse({success: false, message: errorThrown}, args));
		}
	}

	qajax(args) {
		let jqXHR;
		const dfd = $.Deferred();
		const promise = dfd.promise();

		function doRequest(next) {
			jqXHR = $.ajax(args);
			jqXHR.done(dfd.resolve)
				.fail(dfd.reject)
				.then(next, next);
		}

		this.ajaxQueue.queue(doRequest);

		return promise;
	}

	handleAjaxResponse(response, args) {
		if (args.callback) {
			args.callback.call(args.context, Object.assign(response, args.callbackArgs));
		}
	}

	handleButtonAjaxResponse(args) {
		// this.log(args.message);
		this.toggleButtons({buttons: this.settings.buttons, state: 'enable'});

		if (args.button) {
			const text = args.success ? args.texts.success : args.texts.error;
			const css = args.success ? 'updated-message' : 'error';
			args.button.removeClass('updating-message').addClass(css).html(text);
			setTimeout(() => args.button.removeClass(css).html(args.texts.normal), 2000);
		}

		if (args.callback) {
			args.callback.call(args.context, args);
		}
	}

	toggleButtons(args) {
		const disabled = 'disable' === args.state;
		args.buttons.attr('disabled', disabled);
		this.buttonsDisabled = disabled;
	}

/*
	log(message) {
		if (this.config.debug) {
			console.log(message);
		}
	}
*/
}