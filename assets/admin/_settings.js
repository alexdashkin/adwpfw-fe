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
			wrap: '.' + this.registry.prefix + '.wrap',
			tabs: '.tabs-header span.nav-tab',
			buttons: '.button'
		};

		this.ajax = new Ajax({
			registry: this.registry,
			buttons: $(this.elements.wrap).find('button'),
		});

		this.run();
	}

	run() {
		const prefix = this.registry.prefix;
		const $wrap = $(this.elements.wrap);
		const $tabs = $wrap.find(this.elements.tabs);
		const _this = this;

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
			element: $wrap.find('form.' + prefix + '-settings'),
			action: 'save',
			texts: {
				normal: 'Save Changes',
				processing: 'Saving...',
				success: 'Saved',
			}
		}]);

		// Select2
		$('.adwpfw-select2').each(function () {

			const $select2 = $(this);
			const multiple = $select2.prop('multiple');
			const $placeholder = $select2.find('option').first();
			const placeholder = $placeholder.text();

			$placeholder.remove();

			const select2Options = {
				multiple,
				placeholder,
				width: '100%',
			};

			if ($select2.data('ajaxAction')) {
				const action = $select2.data('ajaxAction');

				select2Options.minimumInputLength = 3;

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
			}

			$select2.select2(select2Options);

		});
	}

	switchTab(index) {
		const prefix = this.registry.prefix;
		const $wrap = $(this.elements.wrap);
		const $tabs = $wrap.find(this.elements.tabs);

		if ($tabs.length - 2 < index) index = $tabs.length - 1;

		$tabs.removeClass('nav-tab-active');
		$wrap.find('.tabs-header span.nav-tab:eq(' + index + ')').addClass('nav-tab-active');
		$wrap.find('.tab').hide();
		$wrap.find('.tab:eq(' + index + ')').fadeIn(200);
		localStorage.setItem(prefix + '_last_tab', index);
	}

	addRemove(options, Handlebars) {
		const $wrap = $(options.wrap);

		$wrap.on('click', options.add, function (e) {
			e.preventDefault();

			const $this = $(this);
			const $container = $this.closest(options.container);
			const id = $container.find('> ' + options.removable).length;

			let parentId = 0;
			const $parentContainer = $container.parents(options.container);

			if ($parentContainer.length) {
				parentId = $parentContainer.find('> ' + options.removable).length - 1;
			}

			const template = Handlebars.compile($($this.data('tpl')).html());

			$(template({id, parentId})).insertBefore($this);
		});

		$wrap.on('click', options.remove, function (e) {
			e.preventDefault();
			$(this).closest(options.removable).remove();
		});
	}
}