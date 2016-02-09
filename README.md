# agile-telecom-sms-node-js

This is library for sending SMS through Agile Telecom API.

Get started:
Run the commands
```
git init
git remote add origin https://github.com/Marindrew/agile-telecom-sms-node-js
git pull origin master
npm install
node test.js
```

Test example:

```
var AgileClient = require("./agileClient");

var agileClient = new AgileClient("test", "test", function(err, result) {
	if(!err && result && result.client) {
		result.client.sendSms({
			toPhoneNumber: "+447955585777",
			text: "Hellowold"
		}, function(_err, _result) {
			console.log(_err, _result);
		});
	}
});
```