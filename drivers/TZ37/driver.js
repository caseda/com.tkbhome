'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// TZ37: http://www.tkbhome.com/?cn-p-d-314.html

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		onoff: {
			command_class: 'COMMAND_CLASS_SWITCH_BINARY',
			command_get: 'SWITCH_BINARY_GET',
			command_set: 'SWITCH_BINARY_SET',
			command_set_parser: value => ({
				'Switch Value': (value) ? 'on/enable' : 'off/disable',
			}),
			command_report: 'SWITCH_BINARY_REPORT',
			command_report_parser: report => report.Value === 'on/enable',
		}
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
