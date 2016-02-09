var AgileClient = require("./agileClient");

var agileClient = new AgileClient("test", "test", function(err, result) {
	if(!err && result && result.client) {
		result.client.sendSms({
			fromPhoneNumber: "Hiboo",
			toPhoneNumber: "+447955585777",
			text: "this is test message",
			gatewayQuality: result.client.gatewayQualityHigh,
		}, function(_err, _result) {
			
		});
	}
});
