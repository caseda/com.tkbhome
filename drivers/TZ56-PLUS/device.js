'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TZ56PlusSwitch extends ZwaveDevice {
	async onMeshInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY');

		// Flows
		let TZ56PlusRightSingleOn = new Homey.FlowCardTriggerDevice('TZ56PLUSD_s2_single_on');
		TZ56PlusRightSingleOn
			.register();

		let TZ56PlusRightSingleOff = new Homey.FlowCardTriggerDevice('TZ56PLUSD_s2_single_off');
		TZ56PlusRightSingleOff
			.register();

		let TZ56PlusRightDoubleOn = new Homey.FlowCardTriggerDevice('TZ56PLUSD_s2_double_on');
		TZ56PlusRightDoubleOn
			.register();

		let TZ56PlusRightDoubleOff = new Homey.FlowCardTriggerDevice('TZ56PLUSD_s2_double_off');
		TZ56PlusRightDoubleOff
			.register();

		// Single/double press function
		let singlePress = false;

		this.node.on('nif', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				setTimeout(() => {
					CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET()
						.then(result => {
							this.log(result);
							if (result.hasOwnProperty('Value (Raw)')) {
								this.setCapabilityValue('onoff', result['Value (Raw)'][0] > 0);
								this.setCapabilityValue('dim', (result['Value (Raw)'][0] === 255) ? 1 : result['Value (Raw)'][0] / 99);
							}
						});
				}, 2000);
			}

			singlePress = true;
			setTimeout(() => {
				singlePress = false;
			}, 200);
		});

		this.node.on('_applicationUpdate', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				setTimeout(() => {
					CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET()
						.then(result => {
							this.log(result);
							if (result.hasOwnProperty('Value (Raw)')) {
								this.setCapabilityValue('onoff', result['Value (Raw)'][0] > 0);
								this.setCapabilityValue('dim', (result['Value (Raw)'][0] === 255) ? 1 : result['Value (Raw)'][0] / 99);
							}
						});
				}, 2000);
			}

			singlePress = true;
			setTimeout(() => {
				singlePress = false;
			}, 200);
		});

		// Report listereners
		this.registerReportListener('BASIC', 'BASIC_SET', report => {

			if (report.hasOwnProperty('Value')) {

				if (singlePress) {
					if (report.Value === 255) TZ56PlusRightSingleOn.trigger(this, null, null);
					if (report.Value === 0) TZ56PlusRightSingleOff.trigger(this, null, null);
				} else {
					if (report.Value === 255) TZ56PlusRightDoubleOn.trigger(this, null, null);
					if (report.Value === 0) TZ56PlusRightDoubleOff.trigger(this, null, null);
				}
			}
		});
	}
}

module.exports = TZ56PlusSwitch;
