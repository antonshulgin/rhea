((R) => {
	'use strict';

	window.addEventListener('DOMContentLoaded', init, { once: true, passive: true });

	function init() {
		document
			.getElementById('View')
			.appendChild(R.Calculator().render())
		;
	}

})((window.R = {}));
