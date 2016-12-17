'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// Device => http://www.tkbhome.com/?cn-p-d-277.html
// Alliance => http://products.z-wavealliance.org/products/1423
// Manual => http://www.mondoplast.ro/download/6415/TZ-68.pdf

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		'onoff': {
			'command_class': 'COMMAND_CLASS_SWITCH_BINARY',
			'command_get': 'SWITCH_BINARY_GET',
			'command_set': 'SWITCH_BINARY_SET',
			'command_set_parser': value => {
				return {
					'Switch Value': (value > 0) ? 255 : 0
				};
			},
			'command_report': 'SWITCH_BINARY_REPORT',
			'command_report_parser': report => report['Value'] === 'on/enable',
			'pollInterval': 'poll_interval'
		}
	},
	settings: {
		"led_behaviour": {
			"index": 1,
			"size": 1,
		}
	}
});
