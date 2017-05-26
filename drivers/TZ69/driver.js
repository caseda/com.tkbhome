'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// Device => http://www.tkbhome.com/?cn-p-d-270.html
// Alliance => http://products.z-wavealliance.org/products/1640
// Manual => http://products.z-wavealliance.org/ProductManual/File?folder=&filename=Manuals/1640/TZ69%20english%20manual.pdf

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
			pollInterval: 'poll_interval',
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
		indicator: {
			index: 1,
			size: 1,
		},
		save_state: {
			index: 2,
			size: 1,
		},
		watt_report: {
			index: 3,
			size: 2,
			parser: newValue => new Buffer([Math.round(newValue / 5)]),
		},
		kwh_report: {
			index: 4,
			size: 2,
			parser: newValue => new Buffer([Math.round(newValue / 10)]),
		},
	},
});
