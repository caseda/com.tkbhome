'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// Device => http://www.tkbhome.com/?cn-p-d-259.html
// Alliance => http://products.z-wavealliance.org/products/1324
// Manual => http://products.z-wavealliance.org/ProductManual/File?folder=&filename=Manuals/1324/TKB%20TZ88%20manual-20150527.pdf

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
		},
		measure_voltage: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				Properties1: {
					Scale: 4,
				}
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties2') &&
					report.Properties2.hasOwnProperty('Scale bits 10') &&
					report.Properties2['Scale bits 10'] === 4) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
			pollInterval: 'poll_interval_voltage'
		},
		measure_current: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				Properties1: {
					Scale: 5,
				}
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties2') &&
					report.Properties2.hasOwnProperty('Scale bits 10') &&
					report.Properties2['Scale bits 10'] === 5) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
			pollInterval: 'poll_interval_amperage'
		},
		measure_power: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				Properties1: {
					Scale: 2,
				}
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties2') &&
					report.Properties2.hasOwnProperty('Scale bits 10') &&
					report.Properties2['Scale bits 10'] === 2) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
		},
		meter_power: {
			command_class: 'COMMAND_CLASS_METER',
			command_get: 'METER_GET',
			command_get_parser: () => ({
				Properties1: {
					Scale: 0,
				}
			}),
			command_report: 'METER_REPORT',
			command_report_parser: report => {
				if (report.hasOwnProperty('Properties2') &&
					report.Properties2.hasOwnProperty('Scale bits 10') &&
					report.Properties2['Scale bits 10'] === 0) {
					return report['Meter Value (Parsed)'];
				}
				return null;
			},
		},
	},
	settings: {
		watt_interval: {
			index: 1,
			size: 2,
			parser: newValue => new Buffer([newValue / 5]),
		},
		kwh_interval: {
			index: 2,
			size: 2,
			parser: newValue => new Buffer([newValue / 10]),
		},
		amp_overload: {
			index: 3,
			size: 2,
			parser: newValue => new Buffer([Math.round(newValue * 100)]),
		},
		restore_state: {
			index: 5,
			size: 1,
		},
		amp_overload: {
			index: 6,
			size: 1,
			parser: newValue => new Buffer([(newValue) ? 0 : 1]),
		},
		led_behaviour: {
			index: 7,
			size: 1,
		},
		auto_off: {
			index: 8,
			size: 2,
		},
	},
});

Homey.manager('flow').on('action.TZ88_reset_meter', (callback, args) => {
	const node = module.exports.nodes[args.device.token];

	if (typeof node.instance.CommandClass.COMMAND_CLASS_METER !== 'undefined') {
		node.instance.CommandClass.COMMAND_CLASS_METER.METER_RESET({}, (err, result) => {
			if (err) return callback(err, false);
			if (result === 'TRANSMIT_COMPLETE_OK') return callback(null, true);
			return callback(result, false);
		});
	} else return callback('device_not_available', false);
});

module.exports.on('initNode', token => {
	const node = module.exports.nodes[token];
	if (node && typeof node.instance.CommandClass.COMMAND_CLASS_ALARM !== 'undefined') {

		node.instance.CommandClass.COMMAND_CLASS_ALARM.on('report', (command, report) => {
			if (command && report &&
				command.name === 'ALARM_REPORT' &&
				report.hasOwnProperty('Alarm Type') &&
				report.hasOwnProperty('Alarm Level') &&
				report['Alarm Type'] === 8 &&
				report['Alarm Level'] === 255) {
				Homey.manager('flow').triggerDevice('TZ88_overload_alarm', null, null, node.device_data);
			}
		});
	}
});
