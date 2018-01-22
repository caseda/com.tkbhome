'use strict';

const Homey = require('homey');
const ZwaveMeteringDevice = require('homey-meshdriver').ZwaveMeteringDevice;

class TZ88MeteringPlug extends ZwaveMeteringDevice {
	async onMeshInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY', {
			pollInterval: this.getSetting('poll_interval') * 1000,
		});
		this.registerCapability('measure_power', 'METER');
		this.registerCapability('meter_power', 'METER');
		this.registerCapability('measure_current', 'METER', {
			pollInterval: this.getSetting('poll_interval_current') * 1000,
		});
		this.registerCapability('measure_voltage', 'METER', {
			pollInterval: this.getSetting('poll_interval_current') * 1000,
		});

		// Settings
		this.registerSetting('watt_interval', value => value / 5);
		this.registerSetting('kwh_interval', value => value / 10);
		this.registerSetting('amp_overload', value => Math.round(value * 100));
		this.registerSetting('always_on', value => (value) ? 0 : 1);

		// Flows
		let oldMeterResetAction = new Homey.FlowCardAction('TZ88_reset_meter');
		oldMeterResetAction
			.register();

		oldMeterResetAction
		.registerRunListener(() => Promise.reject('card_not_used_anymore_use_new_reset_card');

		let resetMeterFlowAction = new Homey.FlowCardAction('resetMeter');
		resetMeterFlowAction
			.register();

		let commandClassMeter = this.getCommandClass('METER');
		if (!(commandClassMeter instanceof Error) && typeof commandClassMeter.METER_RESET === 'function') {

			resetMeterFlowAction.registerRunListener(() => {
				commandClassMeter.METER_RESET({}, (err, result) => {
					if (err || result !== 'TRANSMIT_COMPLETE_OK') return Promise.reject(err || result);
					return Promise.resolve();
				});
			});
		}
	}
}

module.exports = TZ88MeteringPlug;
