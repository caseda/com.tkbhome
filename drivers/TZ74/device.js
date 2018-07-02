'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TZ37Switch extends ZwaveDevice {
	async onMeshInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY');
	}
}

module.exports = TZ37Switch;
