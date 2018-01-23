'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TZ65Dimmer extends ZwaveDevice {
	async onMeshInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_MULTILEVEL', {
			setParser: value => {

				const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
				if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
					setTimeout(() => {
						CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET();
					}, 2000);
				}

				return {
					Value: (value) ? 'on/enable' : 'off/disable',
				};
			},
		});

		this.registerCapability('dim', 'SWITCH_MULTILEVEL', {
			getOpts: {
				pollInterval: this.getSetting('poll_interval') * 1000,
			},
		});

		// Flows
		let TZ65RightSingleOn = new Homey.FlowCardTriggerDevice('TZ65D_s2_single_on');
		TZ65RightSingleOn
			.register();

		let TZ65RightSingleOff = new Homey.FlowCardTriggerDevice('TZ65D_s2_single_off');
		TZ65RightSingleOff
			.register();

		let TZ65RightDoubleOn = new Homey.FlowCardTriggerDevice('TZ65D_s2_double_on');
		TZ65RightDoubleOn
			.register();

		let TZ65RightDoubleOff = new Homey.FlowCardTriggerDevice('TZ65D_s2_double_off');
		TZ65RightDoubleOff
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
					if (report.Value === 255) TZ65RightSingleOn.trigger(this, null, null);
					if (report.Value === 0) TZ65RightSingleOff.trigger(this, null, null);
				} else {
					if (report.Value === 255) TZ65RightDoubleOn.trigger(this, null, null);
					if (report.Value === 0) TZ65RightDoubleOff.trigger(this, null, null);
				}
			}
		});
	}
}

module.exports = TZ65Dimmer;
