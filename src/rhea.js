((R) => {
	'use strict';

	R.ENDPOINT_ESI = 'https://esi.evetech.net/dev';

	R.THOUSAND = 1_000;
	R.MILLION  = 1_000_000;
	R.BILLION  = 1_000_000_000;
	R.TRILLION = 1_000_000_000_000;

	R.parseNumber    = parseNumber;
	R.humaniseNumber = humaniseNumber;

	window.addEventListener('DOMContentLoaded', init, { once: true, passive: true });


	function humaniseNumber(number = 0, unit = undefined) {
		const absolute = Math.abs(number);

		if (absolute >= R.TRILLION) { return `${(number / R.TRILLION).toFixed(2)} trillion ${unit || ''}`.trim(); }
		if (absolute >= R.BILLION)  { return `${(number /  R.BILLION).toFixed(2)} billion ${unit  || ''}`.trim(); }
		if (absolute >= R.MILLION)  { return `${(number /  R.MILLION).toFixed(2)} million ${unit  || ''}`.trim(); }
		if (absolute >= R.THOUSAND) { return `${(number / R.THOUSAND).toFixed(2)} thousand ${unit || ''}`.trim(); }

		return `${(number).toFixed(1)} ${unit || ''}`.trim();
	}


	function parseNumber(input) {
		if ((/[0-9., ]k$/i).test(input)) { return doParse() * R.THOUSAND; }
		if ((/[0-9., ]m$/i).test(input)) { return doParse() * R.MILLION; }
		if ((/[0-9., ]b$/i).test(input)) { return doParse() * R.BILLION; }
		if ((/[0-9., ]t$/i).test(input)) { return doParse() * R.TRILLION; }

		return doParse();


		function doParse() {
			const sanitised = input?.replace(/,/g, '.').replace(/[^0-9.]/g, '');
			const parsed    = parseFloat(parseFloat(sanitised).toFixed(2)) || undefined;

			return parsed;
		}
	}


	function init() {
		const ui = {
			calculator: R.Calculator(parseParams()),
		};

		document
			.getElementById('View')
			.replaceChildren(ui.calculator.render())
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
