exports.generateOrgTemplate = function (data,cb) {
	var orgData = {}
	var fs = require('fs');
	var data = data
	// var data = { orgName: 'SAM1', awsRegion: 'us-east-1', cidrRange: '10.1.0.0/16' }

	var outputFilename = '/tmp/' + data.orgName + '.json';

	orgData.id = data.orgName
	orgData.vpc = {};
	orgData.vpc.region = data.awsRegion
	orgData.vpc.cidr = data.cidrRange
	orgData["default_instance_options"] = {};
	orgData["default_instance_options"]["image_id"] = data.defaultAmi
	orgData["default_instance_options"]["monitoring_enabled"] = data.monitoringEnabled
	orgData["default_instance_options"]["instance_type"] = data.defaultInstanceType
	orgData["default_instance_options"]["disable_api_termination"] = data.apiTermination
	orgData["default_instance_options"]["block_device_mappings"] = []
	orgData["default_instance_options"]["block_device_mappings"].push({"device_name": data.defaultDevice, "ebs":{"volume_size": parseInt(data.defaultVolumeSize), "volume_type": "gp2", "delete_on_termination": false}})
	if (data.secondaryEbs == 'true') {
		orgData["default_instance_options"]["block_device_mappings"].push({"device_name": data.secondaryDevice, "ebs":{"volume_size": parseInt(data.secondaryVolumeSize), "volume_type": "gp2", "delete_on_termination": false}})
	}
	orgData["security_groups"] = [];
	orgData["security_groups"].push({"authorize_ingress":[{"protocols": ["-1"],"start": 0,"end": 65535,"sources": ["83.147.149.210/32", "46.38.161.225/32", "54.229.76.48/32", "79.125.117.182/32"]}]});
	
	if (data.selectedGroups == 'coreOnly') {
		securityGroupParser('core');
	}
	if (data.selectedGroups == 'mbaasOnly') {
		securityGroupParser('mbaas1');
	}
	if (data.selectedGroups == 'twoMbaas') {
		var groups = ['mbaas1', 'mbaas2']
		for (group in groups ) {
			securityGroupParser(groups[group]);
		}
	}
	if (data.selectedGroups == 'coreWithMbaas') {
		var groups = ['core', 'mbaas1']
		for (group in groups ) {
			securityGroupParser(groups[group]);
		}
	}
	if (data.selectedGroups == 'coreWithTwoMbaas') {
		var groups = ['core', 'mbaas1', 'mbaas2']
		for (group in groups ) {
			securityGroupParser(groups[group]);
		}
	}
	fs.writeFile(outputFilename, JSON.stringify(orgData, null, 4), function(err) {
	    if(err) {
			console.log(err);
			return cb(err, null);
	    } else {
	     	console.log("JSON saved to " + outputFilename);
		  	return cb(null, orgData)
	    }
	});
	
	function securityGroupParser(group) {
		var jsonData;
		fs.readFile('/Users/pmccarthy/repos/igui/files/' + group + '_sec_groups.json', 'utf8', function (err, data) {
		  if (err) throw err;
		  jsonData = JSON.parse(data);
		  console.log(jsonData)
		  orgData["security_groups"].push(jsonData);
		});
	}
}