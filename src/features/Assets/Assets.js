((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateAssets');

	const REGEX_NAME     = /^([^\t]+)/;
	const REGEX_QUANTITY = /\t([^\t]*)\t/;
	const REGEX_VOLUME   = /\t([^\t]+)m3\t/;
	const REGEX_PRICE    = /\t([^\t]+)ISK/;

	R.Assets = (params = {}) => {
		const form = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			input:    form.querySelector('.Assets-input'),
			doSubmit: form.querySelector('.Assets-doSubmit'),
		};

		form.addEventListener('submit', calculateTotals);

		return {
			render,
			calculateTotals,
		};


		function getTotals(assets = []) {
			const totals = assets.reduce((out, asset) => {
				out.quantity += (asset.quantity || 0);
				out.volume   += (asset.volume   || 0);
				out.price    += (asset.price    || 0);

				return out;
			}, {
				quantity: 0,
				volume:   0,
				price:    0,
			});

			return totals;
		}


		function calculateTotals(event) {
			event?.preventDefault?.();

			const input  = dom.input.value;
			const assets = parseAssets(input);

			const { quantity, volume, price } = getTotals(assets);

			return params.onSubmit({ quantity, volume, price });
		}


		function parseAssets(input = '') {
			return input
				.split(`\n`)
				.filter((item) => !!item.trim().length)
				.map((item)    => parseAsset(item))
			;
		}


		function parseAsset(input = '') {
			const name     = input.match(REGEX_NAME)?.[1]     || 'N/A';
			const quantity = input.match(REGEX_QUANTITY)?.[1] || '1';
			const volume   = input.match(REGEX_VOLUME)?.[1];
			const price    = input.match(REGEX_PRICE)?.[1];

			return {
				name,
				quantity: R.parseNumber(quantity),
				volume:   R.parseNumber(volume),
				price:    R.parseNumber(price),
			};
		}


		function render() { return form; }
	};

})(window.R);
