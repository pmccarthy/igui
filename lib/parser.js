exports.generateOrgTemplate = function (data,cb) {
	var orgData = {}
	var fs = require('fs');
	var data = data
	// var data = { orgName: 'SAM1', awsRegion: 'us-east-1', cidrRange: '10.1.0.0/16' }

	var outputFilename = '/tmp/output.json';

	orgData.id = data.orgName
	orgData.vpc = {};
	orgData.vpc.region = data.awsRegion
	orgData.vpc.cidr = data.cidrRange
	// orgData.vpc["cidr"] = data.cidrRange

	fs.writeFile(outputFilename, JSON.stringify(orgData, null, 4), function(err) {
	    if(err) {
			console.log(err);
			return cb(err, null);
	    } else {
	     	console.log("JSON saved to " + outputFilename);
		  	return cb(null, orgData)
	    }
	});
}