'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.tkbhome.com/?cn-p-d-277.html
// http://www.pepper1.net/zwavedb/device/414
// TZ68

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		'onoff': [
			{
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
				}
			},
			{
				'command_class': 'COMMAND_CLASS_BASIC',
				'command_report': 'BASIC_REPORT',
				'command_report_parser': report => report['Value'] === 255
			}
		]
	},
	settings: {
		"led_behaviour": {
			"index": 1,
			"size": 1,
		},
	}
});
