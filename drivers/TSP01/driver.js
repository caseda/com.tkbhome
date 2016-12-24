'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.tkbhome.com/?cn-p-d-258.html
// http://www.philio-tech.com/pdf/PSP01.pdf
// https://www.intellihome.be/nl/z-wave-tkb-3-in-1-sensor-pir-light-temperature.html
// TSP01

module.exports = new ZwaveDriver( path.basename(__dirname), {
	debug: true,
	capabilities: {
		'alarm_motion': {
			'resetTimer'                : 'motion_inactivity_timer',
			'command_basic_usage'       : 'motion_interact_class_basic',
			'command_class'             : 'COMMAND_CLASS_SENSOR_BINARY',
			'command_report'            : 'SENSOR_BINARY_REPORT',
			'command_report_parser'     : function( report, node ){
				if (report['Sensor Type'] == 'Motion') {
					// setTimeout(function() {node.}, 6000)
					return report['Sensor Value (Raw)'].toString('hex') == 'ff';
				}
			}
		},
		'alarm_tamper': {
			'command_class'             : 'COMMAND_CLASS_SENSOR_BINARY',
			'command_report'            : 'SENSOR_BINARY_REPORT',
			'command_report_parser'     : function( report ){
				if (report['Sensor Type'] == 'Tamper') {
					return report['Sensor Value (Raw)'].toString('hex') == 'ff';
				}
			},
			'optional': true
		},
		'measure_luminance': {
			'command_class'             : 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_report'            : 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser'     : function( report ){
				if (report['Sensor Type'] == 'Luminance (version 1)') return parseInt(report['Sensor Value (Parsed)']) * 10;
			},
			'optional': true
		},
		'measure_temperature': {
			'command_class'             : 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			'command_report'            : 'SENSOR_MULTILEVEL_REPORT',
			'command_report_parser'     : function( report ){
				if (report['Sensor Type'] == 'Temperature (version 1)') return (parseInt(report['Sensor Value (Parsed)']) - 32) * 5 / 9;
			},
			'optional': true
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
						if (optionsCapabilityItem.command_basic_usage) {
							
							let command_basic_usageCallback = () => {
								// Trigger on BASIC_SET
								that._debug(`Registering on COMMAND_CLASS_BASIC for ${deviceDataToken}/${capabilityId}`)
								node.instance.CommandClass['COMMAND_CLASS_BASIC'].on('report', (command, report) => {
									
									if (!report || !report.hasOwnProperty("Value") || !command || !command.hasOwnProperty("name")) return;

									if (command.name === "BASIC_SET") {
										let value = true
										if (report.Value == 100) value = false

										that._debug(`Setting state for ${deviceDataToken}/${capabilityId} to ${value}` )
										// Update value in node state object
										node.state[capabilityId] = value;

										// Emit realtime event
										that.realtime(node.device_data, capabilityId, value);
									}
								})
							}

							// And it is a number, just run it
							if (typeof  optionsCapabilityItem.command_basic_usage === 'boolean') {
								command_basic_usageCallback(optionsCapabilityItem.command_basic_usage * 1000);
							} else if (typeof optionsCapabilityItem.command_basic_usage === 'string') {
								// Get poll interval value from settings
								that.getSettings(node.device_data, (err, settings) => {
									if (err) return console.error(err);

									// Initiate the callback, and report-attachment
									if (settings[optionsCapabilityItem.command_basic_usage] === 'true' || settings[optionsCapabilityItem.command_basic_usage] === true) {
										command_basic_usageCallback();
									} else {
										that._debug(`invalid command_basic_usage type in settings, expected boolean, got ${settings[optionsCapabilityItem.command_basic_usage]} : ` + (typeof optionsCapabilityItem.command_basic_usage))
									}
								});
							} else {
								that._debug('invalid command_basic_usage type, expected boolean or string');
							} 
						}

						// If resetTimer is set for this optionsCapabilityItem
						if (optionsCapabilityItem.resetTimer) {
							that._debug(`Adding resetTimer for ${deviceDataToken}/${capabilityId}`)

							// Create the callback to run, when setTimeout is firing
							node.resetTimerCallback[capabilityId] = refNo => {
								if (node.resetTimerLastActive[capabilityId] == refNo) {
									that._debug(`Resetting state for ${deviceDataToken}/${capabilityId} to false` )
									// Parse value
									const value = false

									// Update value in node state object
									node.state[capabilityId] = value;

									// Emit realtime event
									that.realtime(node.device_data, capabilityId, value);
								} else {
									that._debug(`Not resetting state for ${deviceDataToken}/${capabilityId}, refNo ${refNo} != ${node.resetTimerLastActive[capabilityId]}`)
								}
							}

							// Create callback to use below, when possibly searching for the resetTimer variable.
							let resetTimerCallback = (timeout) => {
								instance.CommandClass[optionsCapabilityItem.command_class].on('report', () => {
									let refNo = Math.random().toString()
									node.resetTimerLastActive[capabilityId] = refNo;

									that._debug(`Got report for ${deviceDataToken}/${capabilityId}, reset after ${timeout} milliseconds if refNo == ${refNo}`)
									setTimeout(node.resetTimerCallback[capabilityId], timeout, refNo)
								})
							};

							// And it is a number, just run it
							if (typeof optionsCapabilityItem.resetTimer === 'number') {
								resetTimerCallback(optionsCapabilityItem.resetTimer * 1000);
							} else if (typeof optionsCapabilityItem.resetTimer === 'string') {
								// Get poll interval value from settings
								that.getSettings(node.device_data, (err, settings) => {
									if (err) return console.error(err);

									// Initiate the callback, and report-attachment
									if (typeof settings[optionsCapabilityItem.resetTimer] === 'number') {
										if (settings[optionsCapabilityItem.resetTimer] > 0) {
											resetTimerCallback(settings[optionsCapabilityItem.resetTimer] * 1000);
										}
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
module.exports._updateSettings = module.exports.settings
module.exports.settings = (deviceData, newSettingsObj, oldSettingsObj, changedKeysArr, callback) => {
	let changedKeys = []
	for (var i = 0; i < changedKeysArr.length; i++) {
		if (changedKeysArr[i] ==  'motion_inactivity_timer' || changedKeysArr[i] == 'motion_interact_class_basic') continue;
		changedKeys.push(changedKeysArr[i])
	}
	module.exports._updateSettings(deviceData, newSettingsObj, oldSettingsObj, changedKeys, callback)
}