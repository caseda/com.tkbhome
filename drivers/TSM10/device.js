'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TSM10MotionContactSensor extends ZwaveDevice {
	async onMeshInit() {
		//this.printNode();
		//this.enableDebug();

		// Register Capabilities
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_contact', 'SENSOR_BINARY');
		this.registerCapability('alarm_tamper', 'SENSOR_BINARY');
		// Register Settings
		this.registerSetting('battery_report_time', value => Math.round(value * 2));
		this.registerSetting('contact_report_time', value => Math.round(value * 2));
	}
}

module.exports = TSM10MotionContactSensor;
