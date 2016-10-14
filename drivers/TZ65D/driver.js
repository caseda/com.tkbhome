'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.tkbhome.com/?cn-p-d-181.html
// http://www.pepper1.net/zwavedb/device/343
// TZ65D

module.exports = new ZwaveDriver( path.basename(__dirname), {
	capabilities: {
		'': {
			'command_class': '',
			'command_get': '',
			'command_set': '',
			'command_set_parser': value => {
			},
			'command_report': '',
			'command_report_parser': report => 
		},
	},
	settings: {
		"": {
			"index": ,
			"size": ,
		},
	}
});
