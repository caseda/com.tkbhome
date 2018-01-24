'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TSP01MotionContactSensor extends ZwaveDevice {
	async onMeshInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
		this.registerCapability('alarm_contact', 'SENSOR_BINARY');
		this.registerCapability('alarm_tamper', 'SENSOR_BINARY');
		this.registerCapability('alarm_motion', 'SENSOR_BINARY');

		this.registerCapability('alarm_motion', 'BASIC', {
			report: 'BASIC_SET',
			reportParser: report => {
				if (report.hasOwnProperty('Value') && report.Value === 0) return false;
				return null;
			}
		});

		this.registerCapability('measure_luminance_level', 'SENSOR_MULTILEVEL', {
			get: 'SENSOR_MULTILEVEL_GET',
			getParser: () => ({
				'Sensor Type': 'Luminance (version 1)',
				Properties1: {
					Scale: 0,
				},
			}),
			report: 'SENSOR_MULTILEVEL_REPORT',
			reportParser: report => {
				if (report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)') && report['Sensor Type'] === 'Luminance (version 1)') {
					luminancePercentageChanged.trigger('TSP01_brightness', { luminance: report['Sensor Value (Parsed)'] }, null);
					return report['Sensor Value (Parsed)'];
				}
				return null;
			},
		})

		// Settings
		this.registerSetting('basic_set_level', value => (value > 99) ? 255 : value);

		this.registerSetting('test_mode', value => {
			let newValue = (this.getSetting('operation_mode')) ? 1 : 0;
			newValue += (value) ? 2 : 0;
			newValue += (this.getSetting('door/window_mode')) ? 4 : 0;
			return newValue + 8;
		});

		this.registerSetting('operation_mode', value => {
			let newValue = (value) ? 1 : 0;
			newValue += (this.getSetting('test_mode')) ? 2 : 0;
			newValue += (this.getSetting('door/window_mode')) ? 4 : 0;
			return newValue + 8;
		});

		this.registerSetting('door/window_mode', value => {
			let newValue = (this.getSetting('operation_mode')) ? 1 : 0;
			newValue += (this.getSetting('test_mode')) ? 2 : 0;
			newValue += (value) ? 4 : 0;
			return newValue + 8;
		});

		this.registerSetting('temperature_monitoring', value => (value) ? 68 : 4);
		this.registerSetting('pir_redetect_interval_time', value => Math.round(value / 8));
		this.registerSetting('turn_off_light_time', value => Math.round(value / 8));
		this.registerSetting('battery_report_time', value => Math.round(value * 2));
		this.registerSetting('contact_report_time', value => Math.round(value * 2));
		this.registerSetting('illumination_report_time', value => Math.round(value * 2));
		this.registerSetting('temperature_report_time', value => Math.round(value * 2));

		// Flows
		let luminancePercentageChanged = new Homey.FlowCardAction('TSP01_brightness');
		luminancePercentageChanged
			.register();
	}
}

module.exports = TSP01MotionContactSensor;
