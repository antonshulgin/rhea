((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateCalculator');

	const MODIFIER_HISEC   = 1;
	const MODIFIER_LOWSEC  = 2;
	const MODIFIER_NULLSEC = 3;

	R.Calculator = (params = {}) => {
		const form = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			inputs: form.querySelectorAll('input'),
			route:  form.querySelector('.Calculator-route'),
			quote:  form.querySelector('.Calculator-quote'),
		};

		form.addEventListener('submit', (event) => { event.preventDefault(); });

		[ ...dom.inputs ].forEach((input) => {
			input.addEventListener('focus', () => input.select(),                { passive: true });
			input.addEventListener('keyup', () => prepareQuote(parseForm(form)), { passive: true });
			input.addEventListener('blur',  (event) => formatValue(event),       { passive: true });
		});

		prepareQuote(params);

		setTimeout(() => form.volume.focus());

		return {
			formatInputValues,
			getCollateral,
			getJumps,
			getVolume,
			prepareQuote,
			render,
		};


		function getVolume()     { return R.parseNumber(form.volume.value)     || 0; }
		function getCollateral() { return R.parseNumber(form.collateral.value) || 0; }


		function getJumps() {
			return {
				jumps:        R.parseNumber(form.jumps.value)        || 0,
				jumpsLowsec:  R.parseNumber(form.jumpsLowsec.value)  || 0,
				jumpsNullsec: R.parseNumber(form.jumpsNullsec.value) || 0,
			};
		}


		function formatValue({ target }) {
			target.value = R.formatNumber(target.value);
		}


		function parseForm(form) {
			const params = [ ...form.elements ].reduce((out, element) => {
				if (!element?.name) { return out; }
				out[element.name] = element.value;
				return out;
			}, {});

			return params;
		}


		function formatInputValues() {
			[ ...dom.inputs ].forEach((input) => { input.value = R.formatNumber(input.value); });
		}


		function prepareQuote(params = {}) {
			const haul = {
				volume:       R.parseNumber(params.volume)       || 0,
				collateral:   R.parseNumber(params.collateral)   || 0,
				jumps:        R.parseNumber(params.jumps)        || 0,
				jumpsLowsec:  R.parseNumber(params.jumpsLowsec)  || 0,
				jumpsNullsec: R.parseNumber(params.jumpsNullsec) || 0,
			};

			if ((haul.jumpsLowsec + haul.jumpsNullsec) > haul.jumps) {
				haul.jumps   = haul.jumpsLowsec + haul.jumpsNullsec;
				params.jumps = haul.jumps;
			}

			Object.entries(params).forEach(([ param, value ]) => { form[param].value = value; });

			dom.quote.textContent = R.humaniseNumber(calculateQuote(haul), 'ISK');
		}


		function render() { return form; }
	};


	// https://www.desmos.com/calculator/kbrd46pe0x
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

})(window.R);
