((R) => {
	'use strict';

	const TEMPLATE = document.getElementById('templateRoute');

	const REGEX_SYSTEM_NAME    = /^([a-zA-Z0-9\- ]+)$/;                                            // Just a system name
	const REGEX_ROUTE_CURRENT  = /^Current location: (.+)$/;                                       // Starting point in the route manager
	const REGEX_ROUTE_STOP     = /^•\s+(.+)$/;                                                     // Intermediate system in the route manager
	const REGEX_ROUTE_STATION  = /^\d+\.\s+(.+?)(?:\s[VIX]+?)?\s-/;                                // Station in the route manager
	const REGEX_ROUTE_WAYPOINT = /^\d+\.\s+(.+?)\s\(/;                                             // Waypoint in the route manager
	const REGEX_DSCAN_STARGATE = /^\d+\s+(.+?)\s+Stargate/;                                        // DScan entry
	const REGEX_SYSTEM_LINK    = /<a href=.+>([a-zA-Z0-9\- ]+)<\/a>/;                              // System link
	const REGEX_SYSTEM_LOCAL   = /EVE System > Channel changed to Local\s+:\s+([a-zA-Z0-9\- ]+)$/; // Local system change message

	R.Route = (params = {}) => {
		const form = document.importNode(TEMPLATE.content, true).firstChild;

		const dom = {
			input:    form.querySelector('.Route-input'),
			doSubmit: form.querySelector('.Route-doSubmit'),
		};

		form.addEventListener('submit', calculateJumps);

		return {
			dom,
			render,
			calculateJumps,
		};


		function calculateJumps(event) {
			event?.preventDefault?.();

			const input   = dom.input.value;
			const systems = parseSystems(input);

			const { jumps, jumpsLowsec, jumpsNullsec } = getJumps(systems);

			return params.onSubmit({ jumps, jumpsLowsec, jumpsNullsec });
		}


		function getJumps(systems = []) {
			const jumps = systems.reduce((out, system) => {
				const securityRaw = window.SYSTEM_DATA?.[system]?.security;

				if (!Number.isFinite(securityRaw)) { return out; }

				out.jumps += 1;

				const security = R.roundTo(securityRaw, 0.1);

				if (security < 0.1) { out.jumpsNullsec += 1; return out; }
				if (security < 0.5) { out.jumpsLowsec  += 1; return out; }

				return out;
			}, {
				jumps:        0,
				jumpsLowsec:  0,
				jumpsNullsec: 0,
			});

			return jumps;
		}


		function parseSystems(input = '') {
			const systems = input
				.split(`\n`)
				.map((waypoint) => waypoint.trim())
				.reduce((out, waypoint) => {
					const systemName = (
						REGEX_SYSTEM_NAME.exec(waypoint)?.[1]    ||
						REGEX_DSCAN_STARGATE.exec(waypoint)?.[1] ||
						REGEX_SYSTEM_LINK.exec(waypoint)?.[1]    ||
						REGEX_SYSTEM_LOCAL.exec(waypoint)?.[1]   ||
						REGEX_ROUTE_STOP.exec(waypoint)?.[1]     ||
						REGEX_ROUTE_STATION.exec(waypoint)?.[1]  ||
						REGEX_ROUTE_CURRENT.exec(waypoint)?.[1]  ||
						REGEX_ROUTE_WAYPOINT.exec(waypoint)?.[1]
					);

					return (systemName && systemName.length > 0)
						? out.concat(systemName)
						: out
					;
				}, [])
			;

			return systems;
		}


		function render() { return form; }
	};

})(window.R);

