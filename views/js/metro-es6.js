"use strict";
String.prototype.toNumber = function(){
	return parseInt(this);
};
Number.prototype.toNumber = function(){
	return this;
};
Array.prototype.toString = function(){
	return JSON.stringify(this);
};
String.prototype.toJSON = function(){
	return JSON.parse(this);
};
Boolean.prototype.toNumber = function() {
	if( this) { return 1;}
	else { return 0;}
};

const WS = 'http://localhost:3000';
var Config = {};
Config.getWsUrl = (resource,settings) => {
	var _url = WS + '/' + resource;
	if(settings){
		if( 'number' == typeof(settings)){
			_url += '?id=' + settings;
		} else {
			_url += '?' + Object.keys(settings)
				.map( key => {
					return key + '=' + settings[key];
				})
				.join('&');
		}
	}
	return _url;
};
