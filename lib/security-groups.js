exports.retrieveSecurityGroups = function (env) {
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