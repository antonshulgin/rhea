((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateAssets');

	const REGEX_NAME     = /^([^\t]+)/;
	const REGEX_QUANTITY = /\t([^\t]*)\t/;
	const REGEX_VOLUME   = /\t([^\t]+)m3\t/;
	const REGEX_PRICE    = /\t([^\t]+)ISK/;

	//const API_ENDPOINT_EVE_TYCOON = 'https://evetycoon.com/api/v1';

	R.Assets = (params = {}) => {
		const form = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			input:    form.querySelector('.Assets-input'),
			doSubmit: form.querySelector('.Assets-doSubmit'),
		};

		form.addEventListener('submit', calculateTotals);

		return Object.freeze({
			//API_ENDPOINT_EVE_TYCOON,
			render,
			calculateTotals,
		});


		function getTotals({ assets = [] }) {
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

			return {
				quantity: R.roundUpTo(totals.quantity, 1),
				volume:   R.roundUpTo(totals.volume, 0.1),
				price:    roundUpPrice(totals.price),
			};
		}


		function roundUpPrice(price = 0) {
			if (price >= R.TRILLION)      { return R.roundUpTo(price * 1.0, R.BILLION); }
			if (price >= R.BILLION)       { return R.roundUpTo(price * 1.1, R.MILLION * 100); }
			if (price >= R.MILLION * 100) { return R.roundUpTo(price * 1.2, R.MILLION * 10); }
			if (price >= R.MILLION)       { return R.roundUpTo(price * 1.3, R.MILLION); }

			return R.roundUpTo(price, R.MILLION);
		}


		function calculateTotals(event) {
			event?.preventDefault?.();

			const input  = dom.input.value;
			const assets = parseAssets(input);

			const { quantity, volume, price } = getTotals({ assets });

			return params.onSubmit({ quantity, volume, price });
		}


		// FIXME?: CORS said 'No'
		//function fetchAppraisal({ assets = [] }) {
			//return new Promise((resolve, reject) => {
				//const queries = assets
					//.filter((asset) => (typeof asset?.typeId === 'number') && isFinite(asset.typeId))
					//.map((asset)    => {
						//return fetch(`${API_ENDPOINT_EVE_TYCOON}/market/orders/${asset.typeId}`)
							//.then((response) => response.json())
							//.catch((error) => console.error('fetchAppraisal', { error }))
						//;
					//})
				//;

				//Promise.all(queries)
					//.then(resolve)
					//.catch(reject)
				//;
			//});
		//}


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
			//const typeId   = ITEM_DATA[name]?.typeId          || undefined;

			return {
				name,
				//typeId,
				quantity: R.parseNumber(quantity),
				volume:   R.parseNumber(volume),
				price:    R.parseNumber(price),
			};
		}


		function render() { return form; }
	};

})(window.R, window.ITEM_DATA);
