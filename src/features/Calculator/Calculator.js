((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateCalculator');

	const THOUSAND = 1_000;
	const MILLION  = THOUSAND * THOUSAND;
	const BILLION  = THOUSAND * MILLION;
	const TRILLION = THOUSAND * BILLION;

	const MODIFIER_HISEC   = 1;
	const MODIFIER_LOWSEC  = 3;
	const MODIFIER_NULLSEC = 4;

	R.Calculator = (params = {}) => {
		const form = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			quote:  form.querySelector('.Calculator-quote'),
			inputs: form.querySelectorAll('input'),
		};

		Array.from(dom.inputs).forEach((input) => {
			input.addEventListener('focus', () => input.select(),                { passive: true });
			input.addEventListener('keyup', () => prepareQuote(parseForm(form)), { passive: true });
		});

		prepareQuote(params);

		return {
			prepareQuote,
			render,
		};


		function parseForm(form) {
			const params = [ ...form.elements ].reduce((out, element) => {
				if (!element?.name) { return out; }
				out[element.name] = element.value;
				return out;
			}, {});

			return params;
		}


		function prepareQuote(params = {}) {
			const haul = {
				volume:       parseNumber(params.volume),
				collateral:   parseNumber(params.collateral),
				jumps:        parseNumber(params.jumps),
				jumpsLowsec:  parseNumber(params.jumpsLowsec),
				jumpsNullsec: parseNumber(params.jumpsNullsec),
			};

			Object.entries(params).forEach(([ param, value ]) => { form[param].value = value; });

			dom.quote.textContent = humaniseNumber(calculateQuote(haul), 'ISK');
		}


		function render() { return form; }
	};


	// https://www.desmos.com/calculator/xpyyfvfzqd
	function calculateQuote({
		volume,
		collateral,
		jumps,
		jumpsLowsec,
		jumpsNullsec,
	}) {
		const haul = {
			volume:       volume       || 0,
			collateral:   collateral   || 0,
			jumps:        jumps        || 0,
			jumpsLowsec:  jumpsLowsec  || 0,
			jumpsNullsec: jumpsNullsec || 0,
		};

		const bulk  = getBulkModifier(haul);
		const value = getValueModifier(haul);
		const route = getRouteModifier(haul);

		const quote = bulk * value * route;

		return quote;
	}


	function getRouteModifier({ jumps, jumpsLowsec, jumpsNullsec }) {
		const hisec   = MODIFIER_HISEC   * (jumps - jumpsLowsec - jumpsNullsec);
		const lowsec  = MODIFIER_LOWSEC  * jumpsLowsec;
		const nullsec = MODIFIER_NULLSEC * jumpsNullsec;

		const routeModifier = Math.sqrt(jumps) * ((hisec + lowsec + nullsec) / jumps);

		return routeModifier || 0;
	}


	function getValueModifier({ volume, collateral }) {
		const valueModifier = Math.sqrt((volume * 1e-3) + Math.sqrt(collateral * 1e-3));

		return valueModifier || 0;
	}


	function getBulkModifier({ volume }) {
		const bulkModifier = 1e5 + ((volume / Math.sqrt(volume)) * 1e3);

		return bulkModifier || 0;
	}


	function parseNumber(string) {
			return (string && parseInt(string.replace(/[^0-9]+/gi, ''), 10)) || 0;
	}


	function humaniseNumber(number = 0, unit = undefined) {
		const absolute = Math.abs(number);

		if (absolute >= TRILLION) { return `${(number / TRILLION).toFixed(1)} trillion ${unit || ''}`.trim(); }
		if (absolute >= BILLION)  { return `${(number /  BILLION).toFixed(1)} billion ${unit  || ''}`.trim(); }
		if (absolute >= MILLION)  { return `${(number /  MILLION).toFixed(1)} million ${unit  || ''}`.trim(); }
		if (absolute >= THOUSAND) { return `${(number / THOUSAND).toFixed(1)} thousand ${unit || ''}`.trim(); }

		return `${(number).toFixed(1)} ${unit || ''}`.trim();
	}

})(window.R);
