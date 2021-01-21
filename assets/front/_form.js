const $ = jQuery;

export default class {

	constructor(options) {
		const defaults = {
			texts: {
				normal: 'Submit',
				processing: 'Sending...',
				success: 'Success!',
				error: 'Error',
			}
		};

		this.settings = Object.assign(defaults, options);
		this.buttonsDisabled = false;
		this.fw = options.registry.fw;
		this.run();
	}

	run() {
		const _this = this;

		this.settings.form.on('submit', function (e) {
			e.preventDefault();
			e.stopPropagation();

			if (_this.buttonsDisabled) {
				_this.fw.log('Submit Disabled');
				return;
			}

			const $this = $(this);
			$this.addClass('was-validated');

			if (!this.checkValidity()) {
				if (_this.settings.invalidCallback) {
					_this.settings.invalidCallback.call(_this.settings.context);
				}

				return;
			}

			const $button = $this.find('.submit');

			const url = _this.settings.url;
			const data = {
				form: $this.serialize(),
				// _wpnonce: _this.settings.registry.restNonce
			};

			if (_this.settings.nonce) {
				data['_wpnonce'] = _this.settings.nonce;
			}

			$button.hide().addClass('processing').html(_this.settings.texts.processing).fadeIn();
			_this.buttonsDisabled = true;

			const callbackArgs = {
				button: $button,
				texts: _this.settings.texts,
				callback: _this.settings.callback,
				context: _this.settings.context,
			};

			_this.fw.ajax({url, data}, _this.processResponse, callbackArgs, _this);
		});
	}

	processResponse(args) {
		this.fw.log(args.message);
		this.buttonsDisabled = false;
		const text = args.success ? args.texts.success : args.texts.error;
		const css = args.success ? 'success' : 'error';
		args.button.hide().removeClass('processing').addClass(css).html(text).fadeIn();

		if (args.callback) {
			args.callback.call(args.context, args);
		}

		setTimeout(function () {
			args.button.removeClass(css).html(args.texts.normal);
		}, 2000);
	}
}
