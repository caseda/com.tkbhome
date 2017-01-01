'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// TSM02/TSP01
// TSM02 Product Page => http://www.tkbhome.com/?cn-p-d-257.html
// TSP01 Product Page => http://www.tkbhome.com/?cn-p-d-258.html
// TSM02 Manual => https://www.intellihome.be/nl/amfilerating/file/download/file_id/1143/
// TSP01 Manual => http://www.philio-tech.com/pdf/PSP01.pdf

let resetCapabilityCallback = (resetToken, node, capabilityId) => {
	if (node.resetToken === resetToken && node.state[capabilityId] === true) {
		module.exports._debug(`[resetCapabilityCallback] Resetting state for ${node.device_data.token}/${capabilityId} to false`);

		// Update local driver state
		node.state[capabilityId] = false;

		// Inform Homey of new value
		module.exports.realtime(node.device_data, capabilityId, false);
	}
}

module.exports = new ZwaveDriver( path.basename(__dirname), {
	debug: true,
	capabilities: {
		'alarm_contact': {
			'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
			'command_get': 'SENSOR_BINARY_GET',
			'command_get_parser': () => ({
				'Sensor Type': 'Door/Window'
			}),
			'command_report': 'SENSOR_BINARY_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === 'Door/Window')
					return report['Sensor Value'] === 'detected an event';
					
				return null;
			},
			'optional': true,
		},
		
		'alarm_motion': [
			{
				'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
				'command_get': 'SENSOR_BINARY_GET',
				'command_get_parser': () => ({
					'Sensor Type': 'Motion',
				}),
				'command_report': 'SENSOR_BINARY_REPORT',
				'command_report_parser': (report, node) => {
					if (report['Sensor Type'] === 'Motion') {
						if (node.hasOwnProperty('resetMotionInterval') && node.resetMotionInterval > 0) {
							let resetToken = Math.random().toString();
							node.resetToken = resetToken;
							module.exports._debug(`Adding timeout of ${node.resetMotionInterval} with token ${resetToken}`);
							setTimeout(resetCapabilityCallback, node.resetMotionInterval, resetToken, node, 'alarm_motion');
						}
						return report['Sensor Value'] === 'detected an event';
					}

					return null;
				}
			},
			{
				'command_class': 'COMMAND_CLASS_BASIC',
				'command_report': 'BASIC_SET',
				'command_report_parser': (report, node) => {
					// If resetMotionInterval is active, then disable this feature.
					if (node.hasOwnProperty('resetMotionInterval') && node.resetMotionInterval > 0)
						return null;

					if (report.Value === 0)
						module.exports._debug(`[BASIC_SET] Resetting state for ${node.device_data.token}/alarm_motion to false`);
						return false;
						
					return null;
				}
			}
		],
		
		'alarm_tamper': {
			'command_class': 'COMMAND_CLASS_SENSOR_BINARY',
			'command_get': 'SENSOR_BINARY_GET',
			'command_get_parser': () => ({
				'Sensor Type': 'Tamper',
			}),
			'command_report': 'SENSOR_BINARY_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === 'Tamper')
					return report['Sensor Value'] === 'detected an event';
					
				return null;
			}
		},
		
		'measure_luminance': {
			'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_get': 'SENSOR_MULTILEVEL_GET',
			'command_get_parser': () => ({
				'Sensor Type': 'Luminance (version 1)',
				'Properties1': {
					'Scale': 1,
				},
			}),
			'command_report': 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === "Luminance (version 1)" &&
				report.hasOwnProperty("Level") &&
				report.Level.hasOwnProperty("Scale")) {
					if (report.Level.Scale === 1)
						return report['Sensor Value (Parsed)'];
						
					if (report.Level.Scale === 0)
						return report['Sensor Value (Parsed)'] * 5;
						
					return null;
				}
					
				return null;
			}
		},
		
		'measure_temperature': {
			'command_class': 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_get': 'SENSOR_MULTILEVEL_GET',
			'command_get_parser': () => ({
				'Sensor Type': 'Temperature (version 1)',
				'Properties1': {
					'Scale': 0,
				},
			}),
			'command_report': 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser': report => {
				if (report['Sensor Type'] === "Temperature (version 1)" &&
				report.hasOwnProperty("Level") &&
				report.Level.hasOwnProperty("Scale")) {
					if (report.Level.Scale === 0)
						return report['Sensor Value (Parsed)'];
					
					if (report.Level.Scale === 1)
						return (report['Sensor Value (Parsed)'] - 32) / 1.8;
					
					return null;
				}
				
				return null;
			}
		},
		
		'measure_battery': {
			'command_class': 'COMMAND_CLASS_BATTERY',
			'command_report': 'BATTERY_REPORT',
			'command_report_parser': report => {
				if (report['Battery Level'] === 'battery low warning')
					return 1;
				
				if (report.hasOwnProperty('Battery Level (Raw)'))
					return report['Battery Level (Raw)'][0];
					
				return null;
			}
		}
	},
	settings: {
		"basic_set_level": {
			"index": 2,
			"size": 1,
			"signed": false,
			"parser": function (input) {
				// Fix user mistakes...
				input = parseInt(input);
				if (input > 100 && input < 255) input = 255;
				return new Buffer([input]);
			},
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
			"parser": (value, settings) => {
				// Operation mode bit 0 (0000000x)
				let param5 = Math.round(Number(settings.operation_mode));
				
				// Operation mode bit 1 (000000x0)
				if (value) {
					Math.round(param5 = param5 + 2);
				}
				
				// Operation mode bit 2 (00000x00)
				if (settings["door/window_mode"]) {
					Math.round(param5 = param5 + 4);
				}
				
				return new Buffer([param5]);
			},
		},
		"operation_mode": {
			"index": 5,
			"size": 1,
			"parser": (value, settings) => {
				// Operation mode bit 0 (0000000x)
				let param5 = Math.round(Number(value));
				
				// Operation mode bit 1 (000000x0)
				if (settings.test_mode) {
					Math.round(param5 = param5 + 2);
				}
				
				// Operation mode bit 2 (00000x00)
				if (settings["door/window_mode"]) {
					Math.round(param5 = param5 + 4);
				}
				
				return new Buffer([param5]);
			},
		},
		"door/window_mode": {
			"index": 5,
			"size": 1,
			"parser": (value, settings) => {
				// Operation mode bit 0 (0000000x)
				let param5 = Math.round(Number(settings.operation_mode));
				
				// Operation mode bit 1 (000000x0)
				if (settings.test_mode) {
					Math.round(param5 = param5 + 2);
				}
				
				// Operation mode bit 2 (00000x00)
				if (value) {
					Math.round(param5 = param5 + 4);
				}
				
				return new Buffer([param5]);
			},
		},
		"temperature_monitoring": {
			"index": 6,
			"size": 1,
			"parser": (value, settings) => {
				// Multi-Sensor Function Switch bit 6 (00x00000)
				let param6 = 4;	// Default value: Disable magetic integrate PIR
				if (value)
					param6 += 64;

				return new Buffer([param6]);
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
		"contact_report_time": {
			"index": 11,
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
	},
	beforeInit: function(deviceDataToken, callback) {
		// module.exports._debug('Running settings for deviceToken', deviceDataToken);
		let node = module.exports.nodes[deviceDataToken];
		// Get poll interval value from settings
		module.exports.getSettings(node.device_data, (err, settings) => {
			if (err) return console.error(err);

			// module.exports._debug('Got settings', deviceDataToken, settings);

			// Initiate poll interval
			if (typeof settings['resetMotionInterval'] === 'number') {
				module.exports._debug(`Got resetMotionInterval ${settings['resetMotionInterval']} for node ${deviceDataToken}`);
				node.resetMotionInterval = settings['resetMotionInterval'] * 1000;
			} else {
				node.resetMotionInterval = 0;
			}
		});
		callback();
	}
});

// Monkey patch to support our custom keys (and not trigger a device update)
module.exports._realSettingsUpdate = module.exports.settings;
module.exports.settings = function(deviceData, newSettingsObj, oldSettingsObj, changedKeysArr, callback) {
	this._debug('driver.settings()', 'newSettingsObj', newSettingsObj, 'oldSettingsObj', oldSettingsObj, 'changedKeysArr', changedKeysArr);

	// We have a custom settings object, remove this from the changedKeysArr
	let changedKeys = [];
	let ignoreKeys = ['resetMotionInterval'];
	let runBeforeInit = false;
	for (var i = 0; i < changedKeysArr.length; i++) {
		if (ignoreKeys.indexOf(changedKeysArr[i]) !== -1) {
			runBeforeInit = true;
			continue;
		}
		changedKeys.push(changedKeysArr[i]);
	}

	if (runBeforeInit === true) {
		this._debug('Trying to run beforeInit again.');
		if (this.options.hasOwnProperty('beforeInit') && typeof this.options.beforeInit === 'function') {
			setTimeout(this.options.beforeInit, 1000, deviceData.token, () => {});
		}
	}

	// Provide user with proper feedback after clicking save
	if (changedKeys.length > 0) {
		this._realSettingsUpdate(deviceData, newSettingsObj, oldSettingsObj, changedKeys, callback);
	} else {
		return callback(null, true);
	}
}.bind(module.exports);
