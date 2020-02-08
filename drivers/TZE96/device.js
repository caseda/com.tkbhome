'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TZE96 extends ZwaveDevice {

	onMeshInit() {
		//enable debugging
		//this.enableDebug();
		//print the node's info to the console
		//this.printNode();

		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
			getOpts: {
				getOnStart: true,
				// pollInterval: 'poll_interval_TEMPERATURE',
				// pollMultiplication: 60000,
			},
		});
		this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT', {
			getOpts: {
				getOnStart: true,
			},
		});
	}

}

module.exports = TZE96;
