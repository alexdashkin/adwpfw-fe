const $ = jQuery;

let options = {};

const defaults = {
	selector: '.adwpfw-notice .notice-dismiss',
	actionPrefix: 'dismiss_notice_',
};

// Send ajax on notices dismiss
export default opts => {

	options = {...defaults, ...opts};

	$(options.selector).on('click', function () {
		const noticeId = $(this).parent().data('id');

		const ajaxData = {
			url: window.ajaxurl,
			method: 'post',
			data: {
				action: options.actionPrefix + noticeId,
				nonce: options.nonce,
			}
		}

		$.ajax(ajaxData);
	});
}
