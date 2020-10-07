import Handlebars from 'handlebars/dist/handlebars.min.js';

const $ = jQuery;

export default class {

	constructor(opts) {
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