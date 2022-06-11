((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateCalculator');

	const THOUSAND = 1_000;
	const MILLION  = 1_000 * THOUSAND;
	const BILLION  = 1_000 * MILLION;
	const TRILLION = 1_000 * BILLION;

	const MODIFIER_HISEC   = 1 / 9;
	const MODIFIER_LOWSEC  = 1 / 6;
	const MODIFIER_NULLSEC = 1 / 3;

	R.Calculator = () => {
		const root = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			quote: root.querySelector('.Calculator-quote'),
		};

		root.addEventListener('submit', doSubmit);

		return {
			render
		};


		function doSubmit(event) {
			event?.preventDefault?.();

			const volume       = parseNumber(root.volume.value);
			const collateral   = parseNumber(root.collateral.value);
			const jumps        = parseNumber(root.jumpsTotal.value);
			const jumpsLowsec  = parseNumber(root.jumpsLowsec.value);
			const jumpsNullsec = parseNumber(root.jumpsNullsec.value);

			const quote = calculateQuote({
				volume,
				collateral,
				jumps,
				jumpsLowsec,
				jumpsNullsec,
			});


			console.log({ quote });

			dom.quote.textContent = humaniseNumber(quote, 'ISK');
		}


		function render() { return root; }
	};


	function calculateQuote({
		volume       = 1,
		collateral   = 1,
		jumps        = 1,
		jumpsLowsec  = 0,
		jumpsNullsec = 0,
	}) {
		volume       ||= 1;
		collateral   ||= 1;
		jumps        ||= 1;
		jumpsLowsec  ||= 0;
		jumpsNullsec ||= 0;

		const jumpModifier   = getJumpModifier({ jumps, jumpsLowsec, jumpsNullsec });
		const volumeModifier = Math.sqrt(volume     / THOUSAND);
		const collatModifier = Math.sqrt(collateral / MILLION);

		const quote = (volumeModifier + collatModifier) * jumpModifier * MILLION;

		return quote;
	}


	function getJumpModifier({
		jumps        = 1,
		jumpsLowsec  = 0,
		jumpsNullsec = 0,
	}) {
		jumps        ||= 1;
		jumpsLowsec  ||= 0;
		jumpsNullsec ||= 0;

		return Math.sqrt(
			(MODIFIER_HISEC   * (jumps - jumpsLowsec - jumpsNullsec)) +
			(MODIFIER_LOWSEC  * jumpsLowsec)                          +
			(MODIFIER_NULLSEC * jumpsNullsec)
		);
	}


	function parseNumber(string) {
		const parsed = parseInt(string.replace(/[^0-9]+/gi, ''), 10) || 0;
		console.log('parseNumber', { string, parsed });
		return parsed;
	}


	function humaniseNumber(number = 0, unit = undefined) {
		const absolute = Math.abs(number);

		if (absolute >= TRILLION) { return `${(number / TRILLION).toFixed(1)} trillion ${unit || ''}`.trim(); }
		if (absolute >= BILLION)  { return `${(number /  BILLION).toFixed(1)} billion ${unit || ''}`.trim(); }
		if (absolute >= MILLION)  { return `${(number /  MILLION).toFixed(1)} million ${unit || ''}`.trim(); }
		if (absolute >= THOUSAND) { return `${(number / THOUSAND).toFixed(1)} thousand ${unit || ''}`.trim(); }

		return `${(number).toFixed(1)} ${unit || ''}`.trim();
	}

})(window.R);
