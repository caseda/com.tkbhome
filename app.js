'use strict';

const Homey = require('homey');

class TKBHomeApp extends Homey.App {
	onInit() {
		this.log(`${Homey.manifest.id} running...`);
	}
}

module.exports = TKBHomeApp;
