import ajaxForm from './_ajax-form.js';

export default opts => {
	const defaults = {
		action: '', // Ajax action name
		selector: 'form.adwpfw-form',
		texts: {
			normal: 'Save Changes',
			processing: 'Saving...',
			success: 'Saved',
			error: 'Error',
		}
	};

	ajaxForm({...defaults, ...opts});
}
