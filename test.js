var AgileClient = require("./agileClient");

var agileClient = new AgileClient("test", "test", function(err, result) {
	if(!err && result && result.client) {
		result.client.sendSms({
			toPhoneNumber: "+11111111111",
			text: "Hellowold"
		}, function(_err, _result) {
			console.log(_err, _result);
		});
	}
});