((R) => {
	'use strict';

	R.ENDPOINT_ESI = 'https://esi.evetech.net/dev';

	R.THOUSAND = 1_000;
	R.MILLION  = 1_000_000;
	R.BILLION  = 1_000_000_000;
	R.TRILLION = 1_000_000_000_000;

	R.parseNumber    = parseNumber;
	R.humaniseNumber = humaniseNumber;
	R.formatNumber   = formatNumber;

	window.addEventListener('DOMContentLoaded', init, { once: true, passive: true });


	function init() {
		const ui = {
			calculator: R.Calculator(parseParams()),
			route:      R.Route({  onSubmit: calculateJumps }),
			assets:     R.Assets({ onSubmit: calculateTotals }),
		};

		document
			.getElementById('ViewBody')
			.replaceChildren(
				ui.calculator.render(),
				ui.route.render(),
				ui.assets.render(),
			)
		;


		function calculateTotals(totals) {
			const haul = {
				volume:     totals.volume,
				collateral: totals.price,
				...ui.calculator.getJumps(),
			};

			ui.calculator.prepareQuote(haul);
			ui.calculator.formatInputValues();
		}


		function calculateJumps(jumps) {
			const haul = {
				volume:     ui.calculator.getVolume(),
				collateral: ui.calculator.getCollateral(),
				...jumps,
			};

			ui.calculator.prepareQuote(haul);
			ui.calculator.formatInputValues();
		}
	}


	function formatNumber(input = 0) {
		const parsed = R.parseNumber(input) || '';

		const [ integer, fractional ] = parsed.toString().split(/[,.]+/);

		const integerFormatted = [ ...integer ]
			.reverse()
			.reduce((out, digit, idx) => {
				return (!(idx % 3)) ? out.concat(' ', digit) : out.concat(digit);
			}, [])
			.reverse()
			.join('')
			.trim()
		;

		const fractionalFormatted = fractional?.slice?.(0,2);

		return !!fractionalFormatted
			? `${integerFormatted}.${fractionalFormatted}`
			: `${integerFormatted}`
		;

	}


	function humaniseNumber(number = 0, unit = undefined) {
		const absolute = Math.abs(number);

		if (absolute >= R.TRILLION) { return `${R.formatNumber(number / R.TRILLION)} trillion ${unit || ''}`.trim(); }
		if (absolute >= R.BILLION)  { return `${R.formatNumber(number /  R.BILLION)} billion ${unit  || ''}`.trim(); }
		if (absolute >= R.MILLION)  { return `${R.formatNumber(number /  R.MILLION)} million ${unit  || ''}`.trim(); }
		if (absolute >= R.THOUSAND) { return `${R.formatNumber(number / R.THOUSAND)} thousand ${unit || ''}`.trim(); }

		return `${R.formatNumber(number)} ${unit || ''}`.trim();
	}


	function parseNumber(input) {
		const inputString = input?.toString?.();

		if (!inputString) { return undefined; }

		if ((/[0-9., ]k$/i).test(inputString)) { return doParse() * R.THOUSAND; }
		if ((/[0-9., ]m$/i).test(inputString)) { return doParse() * R.MILLION; }
		if ((/[0-9., ]b$/i).test(inputString)) { return doParse() * R.BILLION; }
		if ((/[0-9., ]t$/i).test(inputString)) { return doParse() * R.TRILLION; }

		return doParse();


		function doParse() {
			const sanitised = inputString.replace(/,/g, '.').replace(/[^0-9.]/g, '');
			const parsed    = parseFloat(parseFloat(sanitised).toFixed(2)) || undefined;

			return parsed;
		}
	}


	function parseParams(params = new URLSearchParams(location.search)) {
		const parsed = [ ...params.entries() ].reduce((out, [ param, value ]) => {
			out[param] = value;
			return out;
		}, {});

		return parsed;
	}

})((window.R = {}));
