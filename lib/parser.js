exports.generateOrgTemplate = function (data,cb) {
	var orgData = {}
	var fs = require('fs');
	var data = data
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
	orgData["security_groups"] = {};
	orgData["security_groups"]["ops-admin"] = {};
	orgData["security_groups"]["ops-admin"]["authorize_ingress"] = [];
	orgData["security_groups"]["ops-admin"]["authorize_ingress"].push({"protocols": ["-1"],"start": 0,"end": 65535,"sources": ["83.147.149.210/32", "46.38.161.225/32", "54.229.76.48/32", "79.125.117.182/32"]});
	orgData["environments"] = {}
	
	if (data.selectedGroups == 'coreOnly') {
		var env = 'core'
		retrieveSecurityGroups(env)
		generateEnvironment(env)
		generateSubnets(env)
	}
	if (data.selectedGroups == 'mbaasOnly') {
		var env = 'mbaas1'
		retrieveSecurityGroups(env)	
	}
	if (data.selectedGroups == 'twoMbaas') {
		var envs = ['mbaas1','mbaas2']
		for (var env in envs ) {
			retrieveSecurityGroups(envs[env])
		}
	}
	if (data.selectedGroups == 'coreWithMbaas') {
		var envs = ['core','mbaas1']
		for (var env in envs ) {
			retrieveSecurityGroups(envs[env])
		}
	}
	if (data.selectedGroups == 'coreWithTwoMbaas') {
		var envs = ['core', 'mbaas1', 'mbaas2']
		for (var env in envs ) {
			retrieveSecurityGroups(envs[env])
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
	function retrieveSecurityGroups (env) {
		if (env == 'core') {
			var groups = ['core','core-git','core-studio-lb','core-ditch-lb','core-scm-lb','core-sql-lb','core-messaging-lb','core-metrics-lb']
		}
		else if (env == 'mbaas1') {
			var groups = ['mbaas1', 'mbaas1-api-lb','mbaas1-ditch-lb','mbaas1-gw']
		}
		else if (env == 'mbaas2') {
			var groups = ['mbaas2', 'mbaas2-api-lb','mbaas2-ditch-lb','mbaas2-gw']
		}
		else {
			console.log("Unsupported Environment:"+ env +" Must select: core | mbaas1 | mbaas2")
		}
		setSecurityGroups(env, groups);
	}
	function setSecurityGroups(env, groups) {
		console.log(groups)
		for (var group in groups) {
			generatesecurityGroups(env, groups[group]);	
		}
	}
	function generatesecurityGroups(env, group) {
		orgData["security_groups"][group] = {};
		var jsonData = fs.readFileSync(__dirname + '/../files/' + env + '_sec_groups.json', 'utf8');
		jsonData = JSON.parse(jsonData);
	    orgData["security_groups"][group]["authorize_ingress"] = jsonData[env]["authorize_ingress"];
	}
	function generateEnvironment(env) {
		orgData["environments"][env] = {}
		
	}
	function generateSubnets(env) {
		orgData["environments"][env]["subnets"] = {}
	}
}