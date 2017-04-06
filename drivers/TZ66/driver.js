'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');
const singlePress = {};

// TZ66: http://www.tkbhome.com/?cn-p-d-170.html

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		onoff: {
			command_class: 'COMMAND_CLASS_SWITCH_BINARY',
			command_get: 'SWITCH_BINARY_GET',
			command_set: 'SWITCH_BINARY_SET',
			command_set_parser: (value, node) => {
				if (node) {
					setTimeout(() => {
						node.instance.CommandClass.COMMAND_CLASS_SWITCH_BINARY.SWITCH_BINARY_GET();
					}, 300);
				}

				return {
					'Switch Value': (value) ? 'on/enable' : 'off/disable',
				};
			},
			command_report: 'SWITCH_BINARY_REPORT',
			command_report_parser: report => report.Value === 'on/enable',
		}
	},

	beforeInit: (token, callback) => {
		const node = module.exports.nodes[token];
		if (node) {
			if (!singlePress.hasOwnProperty(node.device_data.token)) {
				singlePress[node.device_data.token] = false;
			}
		}

		// Initiate the device
		return callback();
	},

	settings: {
		led_behaviour: {
			index: 3,
			size: 1,
		},
		invert_switch: {
			index: 4,
			size: 1,
		},
		led_behaviour_data: {
			index: 19,
			size: 1,
		},
	},
});

module.exports.on('initNode', token => {
	const node = module.exports.nodes[token];

	if (node) {
		node.instance.on('applicationUpdate', () => {
			node.instance.CommandClass.COMMAND_CLASS_SWITCH_BINARY.SWITCH_BINARY_GET();

			if (singlePress.hasOwnProperty(token)) {
				singlePress[token] = true;
				setTimeout(() => {
					singlePress[token] = false;
				}, 200);
			}
		});

		// Trigger on BASIC_SET
		if (node.instance.CommandClass.COMMAND_CLASS_BASIC !== 'undefined') {
			node.instance.CommandClass.COMMAND_CLASS_BASIC.on('report', (command, report) => {

				if (command.name === 'BASIC_SET') {
					// Single press registered
					if (singlePress[token] === true) {
						// Trigger Single click on flow card
						if (report.Value === 255) Homey.manager('flow').triggerDevice('TZ66D_s2_single_on', null, null, node.device_data);

						// Trigger Single click off flow card
						if (report.Value === 0) Homey.manager('flow').triggerDevice('TZ66D_s2_single_off', null, null, node.device_data);
					}

					// Double press registered
					else if (singlePress[token] === false) {
						// Trigger Double click on flow card
						if (report.Value === 255) Homey.manager('flow').triggerDevice('TZ66D_s2_double_on', null, null, node.device_data);

						// Trigger Double click off flow card
						if (report.Value === 0) Homey.manager('flow').triggerDevice('TZ66D_s2_double_off', null, null, node.device_data);
					}
				}
			});
		}
	}
});
