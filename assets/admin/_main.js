import 'select2';
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

	addRemove(options, Handlebars) {
		const _this = this;
		const $wrap = $(options.wrap);

		$wrap.on('click', options.add, function (e) {
			e.preventDefault();

			const $this = $(this);
			const $wrapper = $this.closest(options.wrap);
			const $container = $this.siblings(options.container);
			const id = $container.find('> ' + options.removable).length;

			let parentId = 0;
			const $parentContainer = $container.parents(options.container).first();

			if ($parentContainer.length) {
				const $selfRemovable = $container.closest(options.removable);
				parentId = $parentContainer.find('> ' + options.removable).index($selfRemovable);
			}

			const template = Handlebars.compile($wrapper.find($this.data('tpl')).html());

			$container.append(template({id, parentId}));

			_this.reIndex(options);

			if (options.callback) {
				options.callback($this);
			}
		});

		$wrap.on('click', options.remove, function (e) {
			e.preventDefault();
			$(this).closest(options.removable).remove();
			_this.reIndex(options);
		});
	}

	reIndex(options) {
		$(options.container).find(options.removable).each(function (index) {
			$(this).find('[name]').each(function () {
				const $this = $(this);
				$this.attr('name', $this.attr('name').replace(/\[\d*\]/, '[' + index + ']'));
			});
		});
	}
}