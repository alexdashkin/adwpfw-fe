const $ = jQuery;

export default class {

	constructor(options) {
		const defaults = {
			debug: false,
		};
		this.settings = Object.assign(defaults, options);
		this.ajaxQueue = $({});
	}

	isMobile() {
		return $(window).width() < 992;
	}

	getQueryParam(key, url) {
		if (!url) url = window.location.href;
		key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		const regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
		const results = regex.exec(url);
		return null === results ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	updateQueryParam(key, value, url) {
		if (!url) url = window.location.href;
		const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
		const separator = url.indexOf('?') !== -1 ? '&' : '?';
		if (url.match(re)) {
			return url.replace(re, '$1' + key + '=' + value + '$2');
		}
		return url + separator + key + '=' + value;
	}

	removeQueryParam(key, url) {
		if (!url) url = window.location.href;
		const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
		if (url.match(re)) {
			return url.replace(re, '$2');
		}
		return url;
	}

	replaceChar(value, index, replacement) {
		return value.substr(0, index) + replacement + value.substr(index + replacement.length);
	}

	objectToArray(obj) {
		return Object.keys(obj).map(function (key) {
			return obj[key];
		});
	}

	ajax(ajaxOptions, callback, callbackArgs, context = this) {
		const defaults = {
			method: 'post',
			// url: ajaxurl,
		};

		this.qajax(Object.assign(defaults, ajaxOptions))
			.done(response => {
				const args = {
					success: response.success,
					message: response.message,
					data: response.data,
				};
				if (callback) {
					callback.call(context, Object.assign(args, callbackArgs));
				}
			})
			.fail((jqXHR, textStatus, errorThrown) => {
				const args = {
					success: false,
					message: errorThrown,
				};
				if (callback) {
					callback.call(context, Object.assign(args, callbackArgs));
				}
			});
	}

	qajax(ajaxOpts) {
		let jqXHR;
		const dfd = $.Deferred();
		const promise = dfd.promise();

		function doRequest(next) {
			jqXHR = $.post(ajaxOpts);
			jqXHR.done(dfd.resolve)
				.fail(dfd.reject)
				.then(next, next);
		}

		this.ajaxQueue.queue(doRequest);

		return promise;
	}

	log(message) {
		if (this.settings.debug) {
			console.log(message);
		}
	}
}