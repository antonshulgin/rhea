((R) => {
	'use strict';

	window.addEventListener('DOMContentLoaded', init, { once: true, passive: true });

	function init() {
		document
			.getElementById('View')
			.appendChild(R.Calculator(parseParams()).render())
		;
	}


	function parseParams(params = new URLSearchParams(location.search)) {
		const parsed = [ ...params.entries() ].reduce((out, [ param, value ]) => {
			out[param] = value;
			return out;
		}, {});

		return parsed;
	}

})((window.R = {}));
