((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateCalculator');

	const THOUSAND = 1_000;
	const MILLION  = THOUSAND * THOUSAND;
	const BILLION  = THOUSAND * MILLION;
	const TRILLION = THOUSAND * BILLION;

	const MODIFIER_HISEC   = 1;
	const MODIFIER_LOWSEC  = 2;
	const MODIFIER_NULLSEC = 3;

	R.Calculator = (params = new URLSearchParams(location.search)) => {
		const form = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			quote:  form.querySelector('.Calculator-quote'),
			inputs: form.querySelectorAll('input'),
		};

		Array.from(dom.inputs).forEach((input) => {
			input.addEventListener('focus', () => input.select(), { passive: true });
		});

		mathItOut(params);

		return {
			mathItOut,
			render,
		};


		function mathItOut(params = new URLSearchParams(location.search)) {
			const haul = {};

			params.forEach((value, name) => {
				haul[name]       = parseNumber(value);
				form[name].value = value;
			});

			dom.quote.textContent = humaniseNumber(calculateQuote(haul), 'ISK');
		}


		function render() { return form; }
	};


	// https://www.desmos.com/calculator/zmedvyh7se
	// https://www.desmos.com/calculator/qfawcnemng

	function calculateQuote({
		volume,
		collateral,
		jumps,
		jumpsLowsec,
		jumpsNullsec,
	}) {
		volume       ||= 0;
		collateral   ||= 0;
		jumps        ||= 0;
		jumpsLowsec  ||= 0;
		jumpsNullsec ||= 0;

		const jumpModifier      = getJumpModifier({ jumps, jumpsLowsec, jumpsNullsec });
		const volumeCollatRatio = getVolumeCollatRatio({ volume, collateral });

		const quote = jumpModifier * volumeCollatRatio * MILLION;

		console.log('calculateQuote', { jumpModifier, volumeCollatRatio, quote });

		return quote;
	}


	function getVolumeCollatRatio({ volume, collateral }) {
		volume     ||= 0;
		collateral ||= 0;

		return Math.sqrt((volume / THOUSAND) + Math.sqrt(collateral / MILLION));
	}


	function getJumpModifier({ jumps, jumpsLowsec, jumpsNullsec }) {
		jumps        ||= 0;
		jumpsLowsec  ||= 0;
		jumpsNullsec ||= 0;

		if (jumps === 0) { return 0; }

		const hs = MODIFIER_HISEC   * (jumps - jumpsLowsec - jumpsNullsec);
		const ls = MODIFIER_LOWSEC  * jumpsLowsec;
		const ns = MODIFIER_NULLSEC * jumpsNullsec;

		return Math.sqrt(jumps) * ((hs + ls + ns) / jumps);
	}


	function parseNumber(string) {
		return parseInt(string.replace(/[^0-9]+/gi, ''), 10) || 0;
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
