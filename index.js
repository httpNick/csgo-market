var request = require('request');
/** Base URL for all GET reuqests */
var baseUrl = "http://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=";
var stattrackString = "StatTrak™";
/** List of all wears */
var wears = ["Field-Tested", "Minimal Wear", "Well-Worn", "Battle-Scarred"];


var CSGOMarket = {
	/** 
	* Retrieve price for a given wep and given wear. Also gives option for stattrak.
	* Returns raw JSON object retrieved from Steam.
	* @param {String} wep Weapon name for request
	* @param {String} skin Skin name for request
	* @param {String} wear The wear of the skin
	* @param {boolean} stattrak boolean for including stattrak to request, 
	*/
	getSinglePrice : function(wep, skin, wear, stattrak, callback) {
			// Mach check for missing "-" in the wear.
			if (wear.toUpperCase() === "FIELD TESTED" 
				|| wear.toUpperCase() === "BATTLE SCARRED"
				|| wear.toUpperCase() === "WELL WORN") {
					wear = wear.replace(" ", "-");
			}
		request(urlify(wep, skin, wear, stattrak), function(err, response, body) {

			if (!err && response.statusCode == 200) {
	    		bodyJSON = JSON.parse(body);
                bodyJSON.wep = wep;
                bodyJSON.skin = skin;
                bodyJSON.wear = wear;
                if (typeof callback === "function") {
	    			callback(bodyJSON)
	    		}
	    		return bodyJSON;
	  		} else {
	  			if (typeof callback === "function") {
	    			callback({
                        wep: wep,
                        skin: skin,
                        wear: wear,
                        success: false
                    })
	    		}
	  			return {
                    wep: wep,
                    skin: skin,
                    wear: wear,
                    success: false};
	  		}
		})
	}
}

/**
* Helper method to format URL for request.
*/
var urlify = function(wep, skin, wear, stattrak) {
	var url = baseUrl;
	if (stattrak) {
		url += encodeURI(stattrackString+" ");
	}
	return url += encodeURI(wep)+encodeURI(' | ')+encodeURI(skin)+encodeURI(' ('+wear+')');
}

module.exports = CSGOMarket;;
