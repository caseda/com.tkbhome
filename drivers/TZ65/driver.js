'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.tkbhome.com/?cn-p-d-180.html <- TZ65S
// http://www.tkbhome.com/?cn-p-d-181.html <- TZ65D
// http://www.pepper1.net/zwavedb/device/424 <- TZ65S
// http://www.pepper1.net/zwavedb/device/343 <- TZ65D

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
				'command_report_parser': report => report['Value' ] > 0
			}
		],
		
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
		"led_behaviour_data": {
			"index": 19,
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
		
		node.instance.CommandClass['COMMAND_CLASS_SWITCH_MULTILEVEL'].on('report', (command, report) => {
			if (command.name === "SWITCH_MULTILEVEL_START_LEVEL_CHANGE") {
				
				if (report.hasOwnProperty("Properties1") &&
				report.Properties1.hasOwnProperty("Up/Down")) {
					
					if (report.Properties1['Up/Down'] === "0") {
						Homey.manager('flow').triggerDevice('TZ65D_s2_hold_down', null, null, node.device_data);
					}
					
					else
					if (report.Properties1['Up/Down'] === "1") {
						Homey.manager('flow').triggerDevice('TZ65D_s2_hold_up', null, null, node.device_data);
					}
				}
			}
			
			else
			if (command.name === "SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE") {
				Homey.manager('flow').triggerDevice('TZ65D_s2_hold_released', null, null, node.device_data);
			}
		});
	}
});
