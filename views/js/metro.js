String.prototype.toNumber = function(){
	return parseInt(this);
};
Number.prototype.toNumber = function(){
	return this;
};
Array.prototype.toString = function(){
	"use strict";
	return JSON.stringify(this);
};
String.prototype.toJSON = function(){
	"use strict";
	return JSON.parse(this);
};
Boolean.prototype.toNumber = function() {
	"use strict";
	if( this) { return 1;}
	else { return 0;}
};
// console.log([1,2,"toto"].toString());
// alert( 'tableau : ' + [1,2,"toto"]);

var WS = 'http://localhost:3000';
var Config = {};
Config.getWsUrl = function(resource,settings){
	"use strict";
	var _url = WS + '/' + resource;
	if(settings){
		if( 'number' == typeof(settings)){
			_url += '?id=' + settings;
		} else {
			_url += '?' + Object.keys(settings)
				.map(function(key){
					return key + '=' + settings[key];
				})
				.join('&');
		}
	}
	if( -1 != _url.indexOf('brands')) { _url = _url.replace('3000','3001')}
	return _url;
};
