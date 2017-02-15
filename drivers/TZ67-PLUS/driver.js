'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.tkbhome.com/?cn-p-d-142.html
// http://products.z-wavealliance.org/products/1604
// TZ67-PLUS

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		'onoff': {
			'command_class': 'COMMAND_CLASS_SWITCH_MULTILEVEL',
			'command_get': 'SWITCH_MULTILEVEL_GET',
			'command_set': 'SWITCH_MULTILEVEL_SET',
			'command_set_parser': value => {
				return {
					'Value': (value > 0) ? 'on/enable' : 'off/disable'
				};
			},
			'command_report': 'SWITCH_MULTILEVEL_REPORT',
			'command_report_parser': report => {
				if (typeof report['Value'] === 'string') return report['Value'] === 'on/enable';
				
				return report['Value (Raw)'][0] > 0;
			},
			'pollInterval': 'poll_interval'
		},
		
		'dim': {
			'command_class': 'COMMAND_CLASS_SWITCH_MULTILEVEL',
			'command_get': 'SWITCH_MULTILEVEL_GET',
			'command_set': 'SWITCH_MULTILEVEL_SET',
			'command_set_parser': value => ({ 'Value': Math.round(value * 99) }),
			'command_report': 'SWITCH_MULTILEVEL_REPORT',
			'command_report_parser': (report, node) => {
				if (typeof report.Value === 'string') return (report.Value === 'on/enable') ? 1.0 : 0.0;

				// Setting on/off state when dimming
				if (!node.state.onoff || node.state.onoff !== (report['Value (Raw)'][0] > 0))
					node.state.onoff = (report['Value (Raw)'][0] > 0);

				return report['Value (Raw)'][0] / 99;
			},
			'pollInterval': 'poll_interval'
		},
	},
	settings: {
		"led_behaviour": {
			"index": 1,
			"size": 1,
		},
	}
});
