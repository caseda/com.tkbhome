'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// Product Page   => http://www.tkbhome.com/?cn-p-d-90.html (INVALID)
// Alliance Page  => http://products.z-wavealliance.org/products/45
// Manual         => http://www.allcontroll.no/wp-content/uploads/2015/11/z_wave_tkb_dual_paddle_wall_switch_manual.pdf

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		'onoff': {
			'command_class': 'COMMAND_CLASS_SWITCH_BINARY',
			'command_get': 'SWITCH_BINARY_GET',
			'command_set': 'SWITCH_BINARY_SET',
			'command_set_parser': value => {
				return {
					'Switch Value': (value > 0) ? 'on/enable' : 'off/disable'
				};
			},
			'command_report': 'SWITCH_BINARY_REPORT',
			'command_report_parser': report => report['Value'] === 'on/enable'
		}
	},
	settings: {
		"led_behaviour": {
			"index": 3,
			"size": 1,
		},
		"invert_switch": {
			"index": 4,
			"size": 1,
		},
		"led_behaviour_data": {
			"index": 19,
			"size": 1,
		},
	}
});

let singlePress = false;
let basicSet = false;

module.exports.on('initNode', token => {
	const node = module.exports.nodes[token];
	
	if (node) {
		// Single press causes an applicationUpdate frame.
		node.instance.on('applicationUpdate', () => {
			// Read out Binary Switch CC after 0,5 seconds on left button
			setTimeout( function() {
				if (basicSet === false) {
					setTimeout( function() {
						node.instance.CommandClass.COMMAND_CLASS_SWITCH_BINARY.SWITCH_BINARY_GET();
					}, 400);
				}
			}, 100);
			
			// set singlePress for 200 mS
			singlePress = true;
			setTimeout( function() {
				singlePress = false;
			}, 200);
		});
		
		// Trigger on BASIC_SET
		node.instance.CommandClass['COMMAND_CLASS_BASIC'].on('report', (command, report) => {
			
			if (!report || !report.hasOwnProperty("Value") || !command || !command.hasOwnProperty("name")) return;
			
			if (command.name === "BASIC_SET") {
			
				// set basicSet for 200 mS
				basicSet = true;
				setTimeout( function() {
					basicSet = false;
				}, 200);
				
				// Single press registered
				if (singlePress === true) {
					// Trigger Single click on flow card
					if (report.Value === 255) {
						Homey.manager('flow').triggerDevice('TZ66D_s2_single_on', null, null, node.device_data);
					}
					
					// Trigger Sinlge click off flow card
					else
					if (report.Value === 0) {
						Homey.manager('flow').triggerDevice('TZ66D_s2_single_off', null, null, node.device_data);
					}
				}
				
				// Double press registered
				else
				if (singlePress === false) {
					// Trigger Double click on flow card
					if (report.Value === 255) {
						Homey.manager('flow').triggerDevice('TZ66D_s2_double_on', null, null, node.device_data);
					}
					
					// Trigger Double click off flow card
					else
					if (report.Value === 0) {
						Homey.manager('flow').triggerDevice('TZ66D_s2_double_off', null, null, node.device_data);
					}
				}
			}
		});
	}
});
