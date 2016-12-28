'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.tkbhome.com/?cn-p-d-258.html
// http://www.philio-tech.com/pdf/PSP01.pdf
// https://www.intellihome.be/nl/z-wave-tkb-3-in-1-sensor-pir-light-temperature.html
// TSP01

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		'alarm_motion': {
			'resetTimer'                : 'motion_inactivity_timer',	// Can reference to a device setting or a number.
			'resetTimerCallback'        : function (capabilityRef, refNo, node) {
				if (capabilityRef.refNo == refNo) {
					module.exports._debug(`Resetting state for ${node.device_data.token}/alarm_motion to false` )
					// Parse value
					const value = false

					// Update value in node state object
					node.state['alarm_motion'] = value;

					// Emit realtime event
					module.exports.realtime(node.device_data, 'alarm_motion', value);
				} else {
					module.exports._debug(`Not resetting state for ${node.device_data.token}/alarm_motion, refNo ${refNo} != ${capabilityRef.refNo}`)
				}
			},
			'command_basic_usage'       : 'motion_interact_class_basic',
			'command_class'             : 'COMMAND_CLASS_SENSOR_BINARY',
			'command_report'            : 'SENSOR_BINARY_REPORT',
			'command_report_parser'     : function( report, node ){
				if (report['Sensor Type'] == 'Motion') {
					// If we got a resolved timeout setting, then act on it
					if (this._resetTimer) {
						let refNo = Math.random().toString()
						this.refNo = refNo;

						module.exports._debug(`Got report for ${node.device_data.token}/alarm_motion, reset after ${this._resetTimer} milliseconds if refNo == ${refNo}`)
						setTimeout(this.resetTimerCallback, this._resetTimer, this, refNo, node)
					}

					return report['Sensor Value'] === 'detected an event';
				}
			}
		},
		'alarm_tamper': {
			'command_class'             : 'COMMAND_CLASS_SENSOR_BINARY',
			'command_report'            : 'SENSOR_BINARY_REPORT',
			'command_report_parser'     : function( report ){
				// If we got a resolved timeout setting, then act on it
				if (report['Sensor Type'] == 'Tamper') {
					if (this._resetTimer) {
						let timeout = parseFloat(this._resetTimer) * 3600;
						let refNo = Math.random().toString();
						this.refNo = refNo;

						module.exports._debug(`Got report for ${node.device_data.token}/alarm_tamper, reset after ${timeout} milliseconds if refNo == ${refNo}`)
						setTimeout(this.resetTimerCallback, timeout, this, refNo, node)
					}
					return report['Sensor Value'] === 'detected an event';
				}
			}
		},
		'alarm_contact': {
			'command_class'             : 'COMMAND_CLASS_SENSOR_BINARY',
			'command_report'            : 'SENSOR_BINARY_REPORT',
			'command_report_parser'     : function( report ){
				if (report['Sensor Type'] == 'Door/Window') {
					return report['Sensor Value'] === 'detected an event';
				}
			}
		},
		'measure_luminance': {
			'command_class'             : 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_report'            : 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser'     : function( report ){
				if (report['Sensor Type'] == 'Luminance (version 1)') return parseInt(report['Sensor Value (Parsed)']) * 10;
			}
		},
		'measure_temperature': {
			'command_class'             : 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_report'            : 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser'     : function( report ){
				if (report['Sensor Type'] == 'Temperature (version 1)') return (parseInt(report['Sensor Value (Parsed)']) - 32) * 5 / 9;
			}
		},
		'measure_battery': {
			'command_class': 'COMMAND_CLASS_BATTERY',
			'command_report': 'BATTERY_REPORT',
			'command_report_parser': report => {
				if (report['Battery Level'] === "battery low warning") return 1;
				
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
		"operation_mode": {
			"index": 5,
			"size": 1,
		},
		"multi_sensor_function_switch": {
			"index": 6,
			"size": 1,
		},
		"pir_redetect_interval_time": {
			"index": 8,
			"size": 1,
		},
		"turn_off_light_time": {
			"index": 9,
			"size": 1,
		},
		"battery_report_time": {
			"index": 10,
			"size": 1,
		},
		"door_sensor_report_time": {
			"index": 11,
			"size": 1,
		},
		"illumination_report_time": {
			"index": 12,
			"size": 1,
		},
		"temperature_report_time": {
			"index": 13,
			"size": 1,
		},
	},
	beforeInit: function(deviceDataToken, callback) {
		const that = module.exports
		const node = that.nodes[deviceDataToken];
		if (node) {

			node.resetTimerCallback = {}
			node.resetTimerLastActive = {}
			that.driver.capabilities.forEach(capabilityId => {

				// Get capability from options object (driver.js)
				let optionsCapability = that.options.capabilities[capabilityId];
				if (typeof optionsCapability === 'undefined') throw new Error(`missing_options_capability: ${capabilityId}`);

				// Force into array
				if (!Array.isArray(optionsCapability)) optionsCapability = [optionsCapability];

				// Loop over potentially nested capability options object
				optionsCapability.forEach((optionsCapabilityItem) => {
					let instance = undefined;

					// Check if it is defined as a multi channel node
					if (typeof optionsCapabilityItem.multiChannelNodeId === 'number') {

						// Get multi channel node instance
						instance = node.instance.MultiChannelNodes[optionsCapabilityItem.multiChannelNodeId];
						if (typeof instance === 'undefined') return callback(new Error('invalid_multiChannelNodeId'));
					} else {
						// Get regular node instance
						instance = node.instance;
					}

					// Check if command class exists on node, necessary because of variable command classes
					if (instance.CommandClass[optionsCapabilityItem.command_class]) {
						if (optionsCapabilityItem.command_basic_usage && instance.CommandClass['COMMAND_CLASS_BASIC']) {
							that._debug(`Configuring command_basic_usage for ${deviceDataToken}/${capabilityId}`)
							if (!optionsCapabilityItem.hasOwnProperty('_command_class_basic_active')) {
								optionsCapabilityItem._command_class_basic_active = false;
							}
							
							if (optionsCapabilityItem._command_class_basic_active === false) {
								that._debug(`Registering on COMMAND_CLASS_BASIC for ${deviceDataToken}/${capabilityId}`)
								instance.CommandClass['COMMAND_CLASS_BASIC'].on('report', (command, report) => {
									if (!optionsCapabilityItem._command_basic_usage) {
										that._debug(`COMMAND_CLASS_BASIC for ${deviceDataToken}/${capabilityId} is not enabled`)
										return; // not enabled via settings
									}
									if (!report || !report.hasOwnProperty("Value") || !command || !command.hasOwnProperty("name")) return;

									if (command.name === "BASIC_SET") {
										let value = true
										if (report.Value == 0) value = false

										that._debug(`Setting state for ${deviceDataToken}/${capabilityId} to ${value}` )
										// Update value in node state object
										node.state[capabilityId] = value;

										// Emit realtime event
										that.realtime(node.device_data, capabilityId, value);
									}
								})

								// If called consecutively then don't bind on another report
								optionsCapabilityItem._command_class_basic_active = true;
							}

							// And it is a number, just run it
							if (typeof  optionsCapabilityItem.command_basic_usage === 'boolean') {
								optionsCapabilityItem._command_basic_usage = optionsCapabilityItem.command_basic_usage;
								that._debug(`setting _command_basic_usage to ${optionsCapabilityItem._command_basic_usage}`)
							} else if (typeof optionsCapabilityItem.command_basic_usage === 'string') {
								// Get poll interval value from settings
								that.getSettings(node.device_data, (err, settings) => {
									if (err) return console.error(err);

									// Initiate the callback, and report-attachment
									if (settings[optionsCapabilityItem.command_basic_usage] === 'true' || settings[optionsCapabilityItem.command_basic_usage] === true) {
										optionsCapabilityItem._command_basic_usage = true;
										that._debug('setting _command_basic_usage to true')
									} else {
										optionsCapabilityItem._command_basic_usage = false;
										that._debug(`disabled command_basic_usage via settings, expected true, got ${settings[optionsCapabilityItem.command_basic_usage]}`)
									}
								});
							} else {
								that._debug('invalid command_basic_usage type, expected boolean or string');
							} 
						}

						// If resetTimer is set for this optionsCapabilityItem then resolve the timeout for the driver
						if (optionsCapabilityItem.resetTimer) {
							that._debug(`Configuring resetTimer for ${deviceDataToken}/${capabilityId}`)

							optionsCapabilityItem._resetTimer = 0;
							// And it is a number, just set it
							if (typeof optionsCapabilityItem.resetTimer === 'number') {
								// resetTimerCallback(optionsCapabilityItem.resetTimer * 1000);
								optionsCapabilityItem._resetTimer = optionsCapabilityItem.resetTimer * 1000;
								that._debug(`setting _resetTimer to ${optionsCapabilityItem._resetTimer}`)
							} else if (typeof optionsCapabilityItem.resetTimer === 'string') {
								// Get poll interval value from settings (async)
								that.getSettings(node.device_data, (err, settings) => {
									if (err) return console.error(err);

									// Initiate the callback, and report-attachment
									if (typeof settings[optionsCapabilityItem.resetTimer] === 'number') {
										optionsCapabilityItem._resetTimer = settings[optionsCapabilityItem.resetTimer] * 1000;
										that._debug(`setting _resetTimer to ${optionsCapabilityItem._resetTimer}`)
									} else {
										that._debug('invalid resetTimer type in settings, expected number')
									}
								});
							} else {
								that._debug('invalid resetTimer type, expected number or string');
							}
						}
					}
				})
			})

			// Continue initialization if we got the node
			callback();
		}
	}
});

// Monkeypatch settings, so we can remove our driver-specific elements from the changedKeysArr
module.exports._updateSettings = module.exports.settings
module.exports.settings = (deviceData, newSettingsObj, oldSettingsObj, changedKeysArr, callback) => {
	let changedKeys = []
	for (var i = 0; i < changedKeysArr.length; i++) {
		if (changedKeysArr[i] ==  'motion_inactivity_timer' || changedKeysArr[i] == 'motion_interact_class_basic') continue;
		changedKeys.push(changedKeysArr[i])
	}
	// Call our beforeInit, to update the settings accordingly, if needed
	if (module.exports.options.hasOwnProperty('beforeInit') && typeof module.exports.options.beforeInit === 'function') {
		setTimeout(module.exports.options.beforeInit, 1000, deviceData.token, () => {});
	}

	module.exports._updateSettings(deviceData, newSettingsObj, oldSettingsObj, changedKeys, callback)
}
