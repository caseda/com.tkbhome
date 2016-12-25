'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');
let basicSetMode = true;

// TSM02/TSP01
// TSM02 Product Page => http://www.tkbhome.com/?cn-p-d-257.html
// TSP01 Product Page => http://www.tkbhome.com/?cn-p-d-258.html
// TSM02 Manual => https://www.intellihome.be/nl/amfilerating/file/download/file_id/1143/
// TSP01 Manual => http://www.philio-tech.com/pdf/PSP01.pdf

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		'alarm_contact': {
			'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
			'command_get': 'SENSOR_BINARY_GET',
			'command_get_parser': () => {
				return {
					'Sensor Type': 'Door/Window'
				};
			},
			'command_report': 'SENSOR_BINARY_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === 'Door/Window')
					return report['Sensor Value'] === 'detected an event';
					
				return null;
			},
			'optional': true
		},
		
		'alarm_motion': [
			{
				'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
				'command_get': 'SENSOR_BINARY_GET',
				'command_get_parser': () => {
					return {
						'Sensor Type': 'Motion'
					};
				},
				'command_report': 'SENSOR_BINARY_REPORT',
				'command_report_parser': report => {
					if (report['Sensor Type'] === 'Motion')
						return report['Sensor Value'] === 'detected an event';
						
					return null;
				},
				'poll_interval': 'poll_interval'
			},
			{
				'command_class': 'COMMAND_CLASS_BASIC',
				'command_report': 'BASIC_SET',
				'command_report_parser': report => {
					if (basicSetMode === true)
						return report.Value > 0;
						
					return null;
				}
			}
		],
		
		'alarm_tamper': {
		'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
		'command_get': 'SENSOR_BINARY_GET',
		'command_get_parser': () => {
			return {
				'Sensor Type': 'Tamper'
			};
		},
		'command_report': 'SENSOR_BINARY_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === 'Tamper')
					return report['Sensor Value'] === 'detected an event';
					
				return null;
			}
		},
		
		'measure_luminance': {
			'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_report': 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === 'Luminance (version 1)')
					return report['Sensor Value (Parsed)'];
					
				return null;
			}
		},
		
		'measure_temperature': {
			'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_report': 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === 'Temperature (version 1)')
					return report['Sensor Value (Parsed)']);
					
				return null;
			}
		},
		
		'measure_battery': {
			'command_class': 'COMMAND_CLASS_BATTERY',
			'command_get': 'BATTERY_GET',
			'command_report': 'BATTERY_REPORT',
			'command_report_parser': report => {
				if (report['Battery Level'] === 'battery low warning') return 1;
				
				return report['Battery Level (Raw)'][0];
			}
		}
	},
	settings: {
		"basic_set_level": {
			"index": 2,
			"size": 1,
		},
		"pir_sensitivity": {
			"index": 3,
			"size": 1,
		},
		"light_sensitivity": {
			"index": 4,
			"size": 1,
		},
		"test_mode": {
			"index": 5,
			"size": 1,
			"parser": (value, newSettings) => {
				let param5 = 0;
				
				//If operation_mode = Security Mode, use 1 for bit 0 (00000001)
				param5 = Math.round(param5 + Number(newSettings.operation_mode));
				
				//If test_mode is true, use 1 for bit 1 (00000010)
				if (value) {
					Math.round(param5 = param5 + 2);
				}
				
				//If door/window_mode is false, use 1 for bit 2 (00000100)
				if (newSettings["door/window_mode"]) {
					Math.round(param5 = param5 + 4);
				}
				
				return new Buffer([param5]);
			},
		},
		"operation_mode": {
			"index": 5,
			"size": 1,
			"parser": (value, newSettings) => {
				let param5 = 0;
				
				//If operation_mode = Security Mode, use 1 for bit 0 (00000001)
				param5 = Math.round(param5 + Number(value));
				
				//If test_mode is true, use 1 for bit 1 (00000010)
				if (newSettings.test_mode) {
					Math.round(param5 = param5 + 2);
				}
				
				//If door/window_mode is false, use 1 for bit 2 (00000100)
				if (newSettings["door/window_mode"]) {
					Math.round(param5 = param5 + 4);
				}
				
				return new Buffer([param5]);
			},
		},
		"door/window_mode": {
			"index": 5,
			"size": 1,
			"parser": (value, newSettings) => {
				let param5 = 0;
				
				//If operation_mode = Security Mode, use 1 for bit 0 (00000001)
				param5 = Math.round(param5 + Number(newSettings.operation_mode));
				
				//If test_mode is true, use 1 for bit 1 (00000010)
				if (newSettings.test_mode) {
					Math.round(param5 = param5 + 2);
				}
				
				//If door/window_mode is true, use 1 for bit 2 (00000100)
				if (value) {
					Math.round(param5 = param5 + 4);
				}
				
				return new Buffer([param5]);
			},
		},
		"pir_redetect_interval_time": {
			"index": 8,
			"size": 1,
			"parser": value => new Buffer([Math.round(value / 8)]),
		},
		"turn_off_light_time": {
			"index": 9,
			"size": 1,
			"parser": value => new Buffer([Math.round(value / 8)]),
		},
		"battery_report_time": {
			"index": 10,
			"size": 1,
			"parser": value => new Buffer([Math.round(value * 2)]),
		},
		"illumination_report_time": {
			"index": 12,
			"size": 1,
			"parser": value => new Buffer([Math.round(value * 2)]),
		},
		"temperature_report_time": {
			"index": 13,
			"size": 1,
			"parser": value => new Buffer([Math.round(value * 2)]),
		},
	}
});
		
module.exports.on('initNode', token => {
	const node = module.exports.nodes[token];

	if (node) {
		// Initial basicSetMode on start of app
		module.exports.getSettings(node.device_data, (err, settings) => {
			if (!err &&
			settings &&
			settings.hasOwnProperty('motion_interact_class_basic')) {
				basicSetMode = settings.motion_interact_class_basic;
			}
		});
	}
});

// Monkeypatch settings, so we can remove our driver-specific element from the changedKeysArr
module.exports._updateSettings = module.exports.settings;
module.exports.settings = (deviceData, newSettingsObj, oldSettingsObj, changedKeysArr, callback) => {
	const changedKeys = [];
	for (var i = 0; i < changedKeysArr.length; i++) {
		if (changedKeysArr[i] === 'motion_interact_class_basic') continue;
		changedKeys.push(changedKeysArr[i]);
	}
	
	// Update basicSetMode variable if needed
	if (changedKeysArr.indexOf('motion_interact_class_basic') > 0 &&
	basicSetMode !== newSettingsObj['motion_interact_class_basic']) {
		basicSetMode = newSettingsObj['motion_interact_class_basic'];
	}
	
	module.exports._updateSettings(deviceData, newSettingsObj, oldSettingsObj, changedKeys, callback);
}
