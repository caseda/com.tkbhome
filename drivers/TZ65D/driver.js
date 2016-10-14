'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.tkbhome.com/?cn-p-d-181.html
// http://www.pepper1.net/zwavedb/device/343
// TZ65D

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
			}
		},
		
		'dim': {
			'command_class': 'COMMAND_CLASS_SWITCH_MULTILEVEL',
			'command_get': 'SWITCH_MULTILEVEL_GET',
			'command_set': 'SWITCH_MULTILEVEL_SET',
			'command_set_parser': value => {
				if (value >= 1) value = 0.99;
				
				return {
					'Value': value * 100
				};
			},
			'command_report': 'SWITCH_MULTILEVEL_REPORT',
			'command_report_parser': report => report['Value (Raw)'][0] / 100
		},
	},
	settings: {
		"night_light": {
			"index": 3,
			"size": 1,
		},
		"invert_switch": {
			"index": 4,
			"size": 1,
		},
		"roller_blind_group2": {
			"index": 14,
			"size": 1,
		},
		"roller_blind_group3": {
			"index": 15,
			"size": 1,
		},
		"led_behaviour_data": {
			"index": 19,
			"size": 1,
		},
		"poll_switch2_interval": {
			"index": 20,
			"size": 1,
		},
		"poll_switch2": {
			"index": 22,
			"size": 1,
		},
	}
});

module.exports.on('initNode', token => {
	const node = module.exports.nodes[token];
	if (node) {
		node.instance.CommandClass['COMMAND_CLASS_BASIC'].on('report', (command, report) => {
			if (report['Value'] === 255) {
				Homey.manager('flow').triggerDevice('TZ65D_s2_on', null, null, node.device_data);
			} else if (report['Value'] === 0) {
				Homey.manager('flow').triggerDevice('TZ65D_s2_off', null, null, node.device_data);
			} else {
				const dimValue = { "dim_level": report['Value'] };
				Homey.manager('flow').triggerDevice('TZ65D_s2_dim', dimValue, null, node.device_data);
			}
		});
	}
});