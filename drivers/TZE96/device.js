'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

const { ManagerZwave } = require('homey');

class TZE96 extends ZwaveDevice {

	onMeshInit() {

		//enable debugging
		this.enableDebug();

		//print the node's info to the console
		this.printNode();

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

/* Node overview
2020-01-08 17:22:30 [log] [TKBHomeApp] init
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] ZwaveDevice has been inited
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] Node: 71 | Manufacturer id: 280 | ProductType id: 785 | Product id: 1286 | Firmware Version: 2.1 | Hardware Version: 1 | Firmware id: 5382 | Secure: ⨯ | Battery: false
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] ------------------------------------------
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] Node: 71
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Manufacturer id: 280
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - ProductType id: 785
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Product id: 1286
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Firmware Version: 2.1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Hardware Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Firmware id: 5382
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Secure: ⨯
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Battery: false
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - DeviceClassBasic: BASIC_TYPE_ROUTING_SLAVE
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - DeviceClassGeneric: GENERIC_TYPE_THERMOSTAT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - DeviceClassSpecific: SPECIFIC_TYPE_THERMOSTAT_GENERAL_V2
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - Token: b29104a3-0f14-462f-b21f-527b77c5d16e
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_ZWAVEPLUS_INFO
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 2
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ZWAVEPLUS_INFO_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ZWAVEPLUS_INFO_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_VERSION
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 2
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- VERSION_COMMAND_CLASS_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- VERSION_COMMAND_CLASS_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- VERSION_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- VERSION_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_MANUFACTURER_SPECIFIC
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 2
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- MANUFACTURER_SPECIFIC_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- MANUFACTURER_SPECIFIC_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- DEVICE_SPECIFIC_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- DEVICE_SPECIFIC_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_DEVICE_RESET_LOCALLY
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- DEVICE_RESET_LOCALLY_NOTIFICATION
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_ASSOCIATION
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 2
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUPINGS_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUPINGS_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_REMOVE
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_SET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_SPECIFIC_GROUP_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_SPECIFIC_GROUP_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_ASSOCIATION_GRP_INFO
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUP_NAME_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUP_NAME_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUP_INFO_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUP_INFO_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUP_COMMAND_LIST_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- ASSOCIATION_GROUP_COMMAND_LIST_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_POWERLEVEL
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- POWERLEVEL_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- POWERLEVEL_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- POWERLEVEL_SET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- POWERLEVEL_TEST_NODE_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- POWERLEVEL_TEST_NODE_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- POWERLEVEL_TEST_NODE_SET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_BASIC
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- BASIC_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- BASIC_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- BASIC_SET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_THERMOSTAT_MODE
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_MODE_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_MODE_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_MODE_SET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_MODE_SUPPORTED_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_MODE_SUPPORTED_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_THERMOSTAT_SETPOINT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_SETPOINT_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_SETPOINT_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_SETPOINT_SET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_SETPOINT_SUPPORTED_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_SETPOINT_SUPPORTED_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_THERMOSTAT_OPERATING_STATE
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_OPERATING_STATE_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- THERMOSTAT_OPERATING_STATE_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_SENSOR_MULTILEVEL
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- SENSOR_MULTILEVEL_GET
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] --- SENSOR_MULTILEVEL_REPORT
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_CONFIGURATION
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:10 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- CONFIGURATION_GET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- CONFIGURATION_REPORT
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- CONFIGURATION_SET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_SWITCH_ALL
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- SWITCH_ALL_GET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- SWITCH_ALL_OFF
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- SWITCH_ALL_ON
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- SWITCH_ALL_REPORT
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- SWITCH_ALL_SET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_CLOCK
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] -- Version: 1
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- CLOCK_GET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- CLOCK_REPORT
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- CLOCK_SET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] - CommandClass: COMMAND_CLASS_FIRMWARE_UPDATE_MD
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] -- Version: 2
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] -- Commands:
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- FIRMWARE_MD_GET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- FIRMWARE_MD_REPORT
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- FIRMWARE_UPDATE_MD_GET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- FIRMWARE_UPDATE_MD_REPORT
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- FIRMWARE_UPDATE_MD_REQUEST_GET
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- FIRMWARE_UPDATE_MD_REQUEST_REPORT
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] --- FIRMWARE_UPDATE_MD_STATUS_REPORT
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0] ------------------------------------------
2020-01-08 17:23:11 [log] [ManagerDrivers] [TZE96] [0]
*/