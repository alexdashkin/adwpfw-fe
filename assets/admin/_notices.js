const $ = jQuery;

// Send ajax on notices dismiss
export default class {

	constructor(opts) {
		const defaults = {
			selector: '.adwpfw-notice .notice-dismiss',
			actionPrefix: 'dismiss_notice_',
		};

		this.opts = Object.assign(defaults, opts);

		this.run();
	}

	run() {
		const _this = this;

		$(this.opts.selector).on('click', function () {

			const noticeId = $(this).parent().data('id');

			const data = {
				action: _this.opts.actionPrefix + noticeId,
				_wpnonce: _this.opts.nonce,
			};

			_this.opts.ajax.run({
				ajaxOpts: {data},
			});
		});
	}
}
