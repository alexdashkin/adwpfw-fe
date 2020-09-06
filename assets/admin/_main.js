import 'select2';
import Handlebars from 'handlebars/dist/handlebars.min.js';
import Logger from './_logger';
import Ajax from './_ajax';

const $ = jQuery;

export default class {

	constructor(options) {
		const defaults = {
			unloadNotify: false,
		};

		this.settings = Object.assign(defaults, options);
		this.registry = options.registry;
		this.formChanged = false;

		this.elements = {
			wrap: '.adwpfw.' + this.registry.prefix,
			tabs: '.adwpfw-tabs-header span.nav-tab',
			buttons: 'button, .button'
		};

		this.ajax = new Ajax({
			registry: this.registry,
			buttons: $(this.elements.wrap).find(this.elements.buttons),
		});

		this.logger = new Logger(this.registry.logger ? this.registry.logger : false, this.registry.prefix);

		this.run();
	}

	run() {
		const prefix = this.registry.prefix;
		const $wrap = $(this.elements.wrap);
		const $tabs = $wrap.find(this.elements.tabs);
		const _this = this;

		// Send ajax on notices dismiss
		$('.adwpfw-notice .notice-dismiss').click(function () {
			const data = {
				action: _this.registry.prefix + '_notice_dismiss',
				_wpnonce: _this.registry.nonce,
				data: {id: $(this).parent().data('id')}
			};

			_this.ajax.run({
				ajaxOpts: {data},
			});
		});

		// Save changes reminder
		if (this.settings.unloadNotify) {
			$('form input').change(() => _this.formChanged = true);
			window.onbeforeunload = () => _this.formChanged ? true : undefined;
		}

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
		$('.' + this.registry.prefix + ' .adwpfw-select2').each(function () {
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
							action: _this.registry.prefix + '_' + action,
							_wpnonce: _this.registry.nonce,
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
		const prefix = this.registry.prefix;
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