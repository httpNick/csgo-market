var request = require('request');
var getClosest = require('get-closest');
var Levenshtein = require('levenshtein');

// Base URL for all GET requests
var baseUrl = "http://steamcommunity.com/";

/**
 * Counter-Strike: Global Offensive
 * http://store.steampowered.com/app/730/
 */
var appID = 730;

// 1 for USD
var currency = 1;
var stattrackString = "StatTrak™";
var starString = "★";

// List of all wears
var wears = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

/**
 * Helper method to format URL for request.
 */
var market_hash = function (wep, skin, wear, stattrak) {
  var url = '';
  if (stattrak) {
    url += stattrackString + ' ';
  }
  return url + wep + ' | ' + skin + ' (' + wear + ')';
};

/**
* Helper method to choose wear.
*/
var closest_wear = function(wear) {
  if (typeof wear === 'string') {
    var closestWear = getClosest.custom(wear, wears, function (a, b) {
      return new Levenshtein(a, b).distance;
  });
    return wear = wears[closestWear];
  } else {
    return wear = wears[2];
  }
}

var knife_market_hash = function(knife, skin, wear, stattrak) {
	var url = starString + ' ';
	if (stattrak) {
	  url += stattrackString + ' ';
	}
	url += knife;
	if (skin === null) {
	  return url;
	} else {
	  return url += ' | ' + skin + ' (' + wear + ')';
	}
}

/**
 * Retrieve price for a given weapon, skin, and wear. Also gives an option for StatTrak.
 *
 * @param {String} wep Weapon name for request
 * @param {String} skin Skin name for request
 * @param {String} wear The wear of the skin
 * @param {Boolean} stattrak Boolean for including StatTrak to request
 * @param {Function} callback Return requested data
 */
exports.getSinglePrice = function (wep, skin, wear, stattrak, callback) {

  // Requires a callback
  if (typeof callback !== 'function') {
    throw new Error('No callback supplied');
  }

  // Pick closest wear to eliminate error
  wear = closest_wear(wear);

  // Combine for unique skin name: StatTrak™ AK-47 | Vulcan (Factory New)
  var market_hash_name = market_hash(wep, skin, wear, stattrak);
  request({
    uri: '/market/priceoverview/',
    baseUrl: baseUrl,
    json: true,
    qs: {
      currency: currency,
      appid: appID,
      market_hash_name: market_hash_name
    }
  }, function (err, response, body) {

    if (!err && response.statusCode === 200) {
      var bodyJSON = body;

      bodyJSON.wep = wep;
      bodyJSON.skin = skin;
      bodyJSON.wear = wear;
      bodyJSON.stattrak = stattrak;
      
      callback(null, bodyJSON);

    } else if (!err && response.statusCode !== 200) {
      callback(new Error('Unsuccessful response'));
    } else {
      callback(err);
    }
  });

};
/**
 * Retrieve price for a single knife. Deserved own method because knives can be on the market
 * without having a skin or wear. Also knives starts with a ★ in their name.
 *
 * @param {String} knife Knife name for request
 * @param {String} skin Skin name for request (null for no skin)
 * @param {String} wear The wear of the skin (null for no wear)
 * @param {Boolean} stattrak Boolean for including StatTrak to request
 * @param {Function} callback Return requested data
 */
exports.getSingleKnifePrice = function(knife, skin, wear, stattrak, callback) {
  // Requires a callback
  if (typeof callback !== 'function') {
    throw new Error('No callback supplied');
  }

  // Pick closest wear to eliminate error. If there is no skin - don't pick a wear.
  if (skin != null) {
    wear = closest_wear(wear);
  } else {
  	wear = null;
  }

  // Combine for unique skin name: ★ StatTrak™ Karambit | Crimson Web (Field-Tested)
  var market_hash_name = knife_market_hash(knife, skin, wear, stattrak);
  request({
  	uri: '/market/priceoverview',
  	baseUrl: baseUrl,
  	json: true,
  	qs: {
  	  currency: currency,
      appid: appID,
  	  market_hash_name: market_hash_name
  	}
  }, function(err, response, body) {
  	  if (!err && response.statusCode === 200) {
        var bodyJSON = body;

        bodyJSON.knife = knife;
        bodyJSON.skin = skin;
        bodyJSON.wear = wear;
        bodyJSON.stattrak = stattrak;
        
        callback(null, bodyJSON);

    } else if (!err && response.statusCode !== 200) {
      callback(new Error('Unsuccessful response'));
    } else {
      callback(err);
    }
  });
};