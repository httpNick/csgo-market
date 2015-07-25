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

// List of all wears
var wears = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

/**
 * Helper method to format URL for request.
 */
var market_hash = function (wep, skin, wear, stattrak) {
  var url = '';
  if (stattrak) {
    url += encodeURI(stattrackString + ' ');
  }
  return url + wep + ' | ' + skin + ' (' + wear + ')';
};

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
  if (typeof wear === 'string') {
    var closestWear = getClosest.custom(wear, wears, function (a, b) {
      return new Levenshtein(a, b).distance;
    });
    wear = wears[closestWear];
  } else {
    wear = wears[2];
  }

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
