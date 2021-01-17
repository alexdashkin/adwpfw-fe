const $ = jQuery;

export default class {

	constructor(opts) {
		const defaults = {
			selector: $('.adwpfw.' + opts.prefix),
		};

		this.opts = Object.assign(defaults, opts);

		this.run();
	}

	run() {
		const prefix = this.opts.prefix;
		const $wrap = $(this.opts.selector);
		const $tabs = $wrap.find('.adwpfw-tabs-header span.nav-tab');
		const _this = this;

		// Initial tab
		let tabIndex = localStorage.getItem(prefix + '_last_tab') || 0;
		this.switchTab(tabIndex);

		// Switch tab on click
		$tabs.on('click', function () {
			_this.switchTab($(this).index())
		});
	}

	switchTab(index) {
		const prefix = this.opts.prefix;
		const $wrap = $(this.opts.selector);
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
