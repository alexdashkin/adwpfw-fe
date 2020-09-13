import 'select2';
import Handlebars from 'handlebars/dist/handlebars.min.js';
import Logger from './_logger';
import Ajax from './_ajax';

const $ = jQuery;

export default class {

	constructor(opts) {
		this.settings = opts;
		this.config = opts.config;

		this.elements = {
			wrap: '.adwpfw.' + this.config.prefix,
			tabs: '.adwpfw-tabs-header span.nav-tab',
			buttons: 'button, .button'
		};

		this.ajax = new Ajax({
			config: this.config,
			buttons: $(this.elements.wrap).find(this.elements.buttons),
		});

		this.logger = new Logger(this.config.logger ? this.config.logger : false, this.config.prefix);

		this.run();
	}

	run() {
		const prefix = this.config.prefix;
		const $wrap = $(this.elements.wrap);
		const $tabs = $wrap.find(this.elements.tabs);
		const _this = this;

		// Send ajax on notices dismiss
		$('.adwpfw-notice .notice-dismiss').click(function () {

			const noticeId = $(this).parent().data('id');

			const data = {
				action: 'dismiss_notice_' + noticeId,
				_wpnonce: _this.config.nonce,
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

		// Select2
		$('.' + this.config.prefix + ' .adwpfw-select2').each(function () {
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
				const action = $select2.data('ajaxAction');

				select2Options.ajax = {
					url: ajaxurl,
					method: 'post',
					delay: 200,

					data(params) {
						return {
							action: _this.config.prefix + '_' + action,
							_wpnonce: _this.config.nonce,
							data: {
								q: params.term
							}
						}
					},

					processResults(data) {
						return {
							results: data.data
						};
					}
				}
			} else {
				select2Options.minimumResultsForSearch = $select2.data('minItemsForSearch');
			}

			$select2.select2(select2Options);
		});
	}

	switchTab(index) {
		const prefix = this.config.prefix;
		const $wrap = $(this.elements.wrap);
		const $tabs = $wrap.find(this.elements.tabs);

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

	addRemove(opts) {
		['add', 'remove'].forEach(function (action) {
			$(opts.wrap).on('click', opts[action], function (e) {
				e.preventDefault();

				const $button = $(this);
				const $container = $button.closest(opts.container);
				const $itemsContainer = $container.find('> ' + opts.items);
				const $items = $itemsContainer.find('> ' + opts.removable);

				switch (action) {
					case 'add':
						const $tpl = $($button.data('tpl'));
						const template = Handlebars.compile($tpl.html());
						const $parentRemovable = $container.closest(opts.removable);
						const id = $items.length ? +$items.last().data('index') + 1 : 0;
						const newItem = template({
							id,
							parentId: $parentRemovable.data('index'),
						});

						$(newItem).data('index', id).appendTo($itemsContainer);

						break;

					case 'remove':
						$button.closest(opts.removable).remove();

						break;
				}

				// If data-regex is provided - re-index items by the regex
				const reIndexRegex = $itemsContainer.data('regex');

				if (reIndexRegex) {
					$itemsContainer.find('> ' + opts.removable).each(function (index) {
						$(this).data('index', index).find('[name]').each(function () {
							const $this = $(this);
							$this.attr('name', $this.attr('name').replace(new RegExp(reIndexRegex), '$1' + index));
						});
					});
				}

				// If callback is provided - call it
				if (opts.callback) {
					opts.callback($button);
				}
			});
		});
	}
}