((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateRoute');

	R.Route = (params = {}) => {
		const form = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			input:    form.querySelector('.Route-input'),
			doSubmit: form.querySelector('.Route-doSubmit'),
		};

		form.addEventListener('submit', calculateJumps);

		return {
			dom,
			render,
			calculateJumps,
		};


		function calculateJumps(event) {
			event?.preventDefault?.();

			return params.onSubmit();
		}


		function render() { return form; }
	};

})(window.R);

