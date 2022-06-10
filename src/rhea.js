((R) => {
	'use strict';

	window.addEventListener('DOMContentLoaded', init, { once: true, passive: true });

	function init() {
		const root = document.getElementById('View');

		root.appendChild(R.Calculator().render());
	}

})((window.R = {}));
