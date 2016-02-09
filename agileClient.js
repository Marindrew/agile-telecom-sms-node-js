var request = require("request");

var agileEndPointSecure = "https://secure.agiletelecom.com/securesend_v1.aspx";
var agileEndPointNotSecure = "http://post.agiletelecom.com/smshurricane3.0.asp";

function AgileClient(_username, _password, callback, debug) {
	var username = _username;
	var password = _password;
	
	if(debug && debug===true)
		this.debug = true;
	else
		this.debug = false;
	
	var that = this;
	if(!username) {
		if(callback)
			process.nextTick(function() {
				callback([that.error("usernameIsRequiredField")], null);
			});
		return this;
	}
	if(!password) {
		if(callback)
			process.nextTick(function() {
				callback([that.error("passwordIsRequiredField")], null);
			});
		return this;
	}
	if(callback)
		process.nextTick(function() {
			callback(null, {success:true, client: that});
		});
	
	this.getUsername = function() {
		return username;
	}
	this.getPassword = function() {
		return password;
	}
	
	return this;
}

// Options can include parameters
// fromPhoneNumber - phone number in international format (maximum 16 char) or alphanumeric string (maximum 11 char)
// toPhoneNumber - optional max 16 char, number of mobile in international format, ex.: +393294938957
// toPhoneNumbers - optional array of phone numbers. In case toPhoneNumers specified, toPhoneNumber filed will be ignored
// gatewayQuality - quality of gateway
// smsType - type of the message
//				file.sms to send a standard text SMS
//				file.flh to send a FLASH text SMS
//				file.uni to send a text SMS with UNICODE
// deliveryIndex - optional field used to identify the message while receiving delivery notifications.
// text - required text of sms (maximum 160 char)
// notSecure - optional boolean parameter to use HTTP POST API instead of HTTPS POST API. 

AgileClient.prototype.sendSms = function (options, callback) {
	//Validating options
	var that = this;
	var errors = [];
	if(!options)
		errors.push(that.error("optionsIsRequiredField"));
	if(!options.text)
		errors.push(that.error("textIsRequiredField"));
	else {
		if(options.text.length>160)
			errors.push(that.error("smsTextShouldBeShorter"));
	}
	if(options.toPhoneNumbers && !Array.isArray(options.toPhoneNumbers))
		errors.push(that.error("toPhoneNumbersShouldBeArray"));
	else {
		if(!options.toPhoneNumber && !options.toPhoneNumbers && options.toPhoneNumbers.length===0)
		errors.push(that.error("toPhoneNumberShouldBeSpecified"));
	}
	if(errors.length>0)
	{
		if(callback)
			process.nextTick(function() {
				callback(errors, null);
			});
		return;
	}
	
	var sendPhoneNumbers = options.toPhoneNumbers?options.toPhoneNumbers:[options.toPhoneNumber];
	var sendPhoneNumbersString = sendPhoneNumbers.join(";");
	if(this.debug)
		console.log("Will send to ", sendPhoneNumbersString);
	
	var formValues = {};
	formValues.smsNUMBER = sendPhoneNumbersString;
	formValues.smsTEXT = options.text;
	formValues.smsUSER = this.getUsername();
	formValues.smsPASSWORD = this.getPassword();
	
	if(options.fromPhoneNumber)
		formValues.smsSENDER = options.fromPhoneNumber;
	if(options.deliveryIndex)
		formValues.smsDELIVERY = options.deliveryIndex;
	if(options.gatewayQuality === this.gatewayQualityHigh)
		formValues.smsGATEWAY = this.gatewayQualityHigh;
	if(options.gatewayQuality === this.gatewayQualityMedium)
		formValues.smsGATEWAY = this.gatewayQualityMedium;
	if(options.smsType === this.smsTypeSMS)
		formValues.smsType = this.smsTypeSMS;
	if(options.smsType === this.smsTypeFLH)
		formValues.smsType = this.smsTypeFLH;
	if(options.smsType === this.smsTypeUNI)
		formValues.smsType = this.smsTypeUNI;
	
	if(this.debug)
		console.log(formValues);
	
	request.post({url:options.notSecure?agileEndPointNotSecure:agileEndPointSecure, form: formValues}, function(err,httpResponse,body){ 
		if(err) {
			if(callback)
				callback([that.error("connectionError")], null);
		} else {
			if(this.debug)
				console.log(body);
			if(body.indexOf("Ok")!==-1 || body.indexOf("OK")!==-1) {
				if(callback)
					callback(null, {success: true});
			} else {
				if(callback)
					callback([that.error("agileError"), {errorCode: -1, errorText: body}], null);
			}
		}
	});
	
	if(callback)
			callback(null, {success: true});
    
}


AgileClient.prototype.gatewayQualityHigh = "H";
AgileClient.prototype.gatewayQualityMedium = "M";
AgileClient.prototype.smsTypeSMS= "file.sms";
AgileClient.prototype.smsTypeFLH= "file.flh";
AgileClient.prototype.smsTypeUNI= "file.uni";


AgileClient.prototype.error = function (errorIdentified) {
	if(!errorIdentified)
		return null;
    var errors = {
    		"authentificationProblem" : {errorCode: 1, errorText: "Authentification problem"},
    		"smsTextShouldBeShorter" : {errorCode: 2, errorText: "Sms text should be shorter than 160 symbols"},
    		"toPhoneNumberShouldBeSpecified" : {errorCode: 3, errorText: "To phone number should be specified"},
    		"usernameIsRequiredField": {errorCode: 4, errorText: "Username is required field"},
    		"passwordIsRequiredField": {errorCode: 5, errorText: "Password is required field"},
    		"optionsIsRequiredField": {errorCode: 6, errorText: "Options is required field"},
    		"textIsRequiredField": {errorCode: 7, errorText: "Text is required field"},
    		"toPhoneNumbersShouldBeArray": {errorCode: 8, errorText: "toPhoneNumbers should be array"},
    		"connectionError": {errorCode: 9, errorText: "error while connecting to server"},
    		"agileError": {errorCode: 9, errorText: "Agile error"},
    		
    };
    return errors[errorIdentified];
}

module.exports = AgileClient;