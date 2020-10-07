const $ = jQuery;

export default class {

	constructor(opts) {
		this.opts = opts;
		this.ajax = opts.ajax;

		this.run();
	}

	run() {
		const prefix = this.opts.prefix;
		const $wrap = $('.adwpfw.' + this.opts.prefix);
		const $tabs = $wrap.find('.adwpfw-tabs-header span.nav-tab');
		const _this = this;

		// Send ajax on notices dismiss
		$('.adwpfw-notice .notice-dismiss').click(function () {

			const noticeId = $(this).parent().data('id');

			const data = {
				action: 'dismiss_notice_' + noticeId,
				_wpnonce: _this.opts.nonce,
			};

			_this.ajax.run({
				ajaxOpts: {data},
			});
		});

		// Initial tab
		let tabIndex = localStorage.getItem(prefix + '_last_tab') || 0;
		this.switchTab(tabIndex);

		// Switch tab on click
		$tabs.click(function () {
			_this.switchTab($(this).index())
		});

		// Save changes
		this.ajax.addForms([{
			element: $wrap.find('form.adwpfw-form'),
			action: 'save',
			texts: {
				normal: 'Save Changes',
				processing: 'Saving...',
				success: 'Saved',
			}
		}]);
	}

	switchTab(index) {
		const prefix = this.opts.prefix;
		const $wrap = $('.adwpfw.' + this.opts.prefix);
		const $tabs = $wrap.find('.adwpfw-tabs-header span.nav-tab');

		if ($tabs.length - 2 < index) {
			index = $tabs.length - 1;
		}

		$tabs.removeClass('nav-tab-active');
		$wrap.find('.adwpfw-tabs-header span.nav-tab').eq(index).addClass('nav-tab-active');
		$wrap.find('.adwpfw-tab').hide();
		$wrap.find('.adwpfw-tab').eq(index).fadeIn(200);

		localStorage.setItem(prefix + '_last_tab', index);

		$wrap.trigger('adwpfw.tab_switched', index);
	}
}