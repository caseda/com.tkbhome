'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TZ35Dimmer extends ZwaveDevice {
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
					}, 2500);
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
		let TZ35RightSingleOn = new Homey.FlowCardTriggerDevice('TZ35D_s2_single_on');
		TZ35RightSingleOn
			.register();

		let TZ35RightSingleOff = new Homey.FlowCardTriggerDevice('TZ35D_s2_single_off');
		TZ35RightSingleOff
			.register();

		let TZ35RightDoubleOn = new Homey.FlowCardTriggerDevice('TZ35D_s2_double_on');
		TZ35RightDoubleOn
			.register();

		let TZ35RightDoubleOff = new Homey.FlowCardTriggerDevice('TZ35D_s2_double_off');
		TZ35RightDoubleOff
			.register();

		// Single/Double press function
		let singlePress = false;

		this.node.on('nif', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET();
			}

			singlePress = true;
			setTimeout(() => {
				singlePress = false;
			}, 200);
		});

		this.node.on('_applicationUpdate', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET();
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
					if (report.Value === 255) TZ35RightSingleOn.trigger(this, null, null);
					if (report.Value === 0) TZ35RightSingleOff.trigger(this, null, null);
				} else {
					if (report.Value === 255) TZ35RightDoubleOn.trigger(this, null, null);
					if (report.Value === 0) TZ35RightDoubleOff.trigger(this, null, null);
				}
			}
		});
	}
}

module.exports = TZ35Dimmer;
