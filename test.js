
var AgileClient = require("./agileClient");

console.log(AgileClient);
		
var agileClient = new AgileClient("test", "test", function(err, result) {
	if(!err && result && result.client) {
		result.client.sendSms({
			toPhoneNumber: "+4479855585777",
			text: "This is test message",
			gatewayQuality: result.client.gatewayQualityHigh
		}, function(_err, _result) {
			console.log(_err, _result);
		});
	}
}, true);