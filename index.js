var request = require('request');
var getClosest = require('get-closest');
var Levenshtein = require('levenshtein');
var Q = require('q');
var hashName = require('./hashname.js');

/**
* Helper method to choose wear.
*/
var closest_wear = function(wear) {
  // List of all wears
  var wears = [
    'Factory New', 'Minimal Wear',
    'Field-Tested', 'Well-Worn',
    'Battle-Scarred'
  ];

  if (typeof wear === 'string') {
    var closestWear = getClosest.custom(wear, wears, function (a, b) {
      return new Levenshtein(a, b).distance;
  });
    return wear = wears[closestWear];
  } else {
    return wear = wears[2];
  }
};

var makeRequest = function(market_hash_name, callback) {

  // Requires a callback
  if (typeof callback !== 'function') {
    throw new Error('No callback supplied');
  }

  // Base URL for all GET requests
  var baseUrl = 'http://steamcommunity.com/';
  var uri = '/market/priceoverview/';

  /**
   * Counter-Strike: Global Offensive
   * http://store.steampowered.com/app/730/
   */
  var appID = 730;

  // 1 for USD
  var currency = 1;

  request({
    uri: uri,
    baseUrl: baseUrl,
    json: true,
    qs: {
      currency: currency,
      appid: appID,
      market_hash_name: market_hash_name
    }
  }, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      callback(null, body);
    } else if (!err && response.statusCode !== 200) {
      callback(new Error('Unsuccessful response'));
    } else {
      callback(err);
    }
  });
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
  var wear = closest_wear(wear);

  // Combine for unique skin name: StatTrak™ AK-47 | Vulcan (Factory New)
  var market_hash_name = hashName.gunHash(
    wep,
    skin,
    wear,
    stattrak
  );

  makeRequest(market_hash_name, function(err, body) {
    !err ? (
      bodyJSON = body,
      bodyJSON.wep = wep,
      bodyJSON.skin = skin,
      bodyJSON.wear = wear,
      bodyJSON.stattrak = stattrak,
      callback(null, bodyJSON)
    ) :
    (
      callback(err)
    )
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
  var market_hash_name = hashName.knifeHash(
    knife,
    skin,
    wear,
    stattrak
  );

  makeRequest(market_hash_name, function(err, body) {
    !err ? (
      bodyJSON = body,
      bodyJSON.knife = knife,
      bodyJSON.skin = skin,
      bodyJSON.wear = wear,
      bodyJSON.stattrak = stattrak,
      callback(null, bodyJSON)
    ) :
    (
      callback(err)
    )
  });
};

/**
 * Retrieve price for a single sticker.
 *
 * @param {String} stickerName name of sticker for request
 * @param {Boolean} foil Boolean for including foil to the request.
 * @param {Function} callback Return requested data
 */
exports.getSingleStickerPrice = function(stickerName, foil, callback) {
  // Requires a callback
  if (typeof callback !== 'function') {
    throw new Error('No callback supplied');
  }

  var market_hash_name = hashName.stickerHash(
    stickerName,
    foil
  );

  makeRequest(market_hash_name, function(err, body) {
    !err ? (
      bodyJSON = body,
      bodyJSON.stickername = market_hash_name,
      bodyJSON.foil = foil,
      callback(null, bodyJSON)
    ) :
    (
      callback(err)
    )
  });
};

/**
* Retrieve price for a single key.
*
* @param {string} key: name of the key.
* @param {Function} callback: returned data.
*/
exports.getSingleKeyPrice = function(key, callback) {
  // Requires a callback
  if (typeof callback !== 'function') {
    throw new Error('No callback supplied');
  }

  var market_hash_name = hashName.keyHash(
    key
  );

  makeRequest(market_hash_name, function(err, body) {
    !err ? (
      bodyJSON = body,
      bodyJSON.key = market_hash_name,
      callback(null, bodyJSON)
    ) :
    (
      callback(err)
    )
  });
};

/**
* Promisified version of the getSinglePrice function.
* Big thanks Roamer-1888 on Stackoverflow for help with this function.
* Returns a Q promise which can be used by outside functions to handle multiple calls.
*/
exports.getSinglePriceAsync = function(wep, skin, wear, stattrak) {
  return Q.Promise(function(resolve, reject) {
    exports.getSinglePrice(wep, skin, wear, stattrak, function(err, result) {
      if (err) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};

/**
* Promisifed version of the getSingleKnifePrice function.
* Big thanks Roamer-1888 on Stackoverflow for help with this function.
* Returns a Q promise which can be used by outside functions to handle multiple calls.
*/
exports.getSingleKnifePriceAsync = function(knife, skin, wear, stattrak) {
  return Q.Promise(function(resolve, reject) {
    exports.getSingleKnifePrice(wep, skin, wear, stattrak, function(err, result) {
      if (err) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};

/**
* Promisified version of the getSingleStickerPrice function.
*/
exports.getSingleStickerPriceAsync = function(stickerName, foil) {
  return Q.Promise(function(resolve, reject) {
    exports.getSingleStickerPrice(stickerName, foil, function(err, result) {
      if (err) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};

/**
* Promisified version of the getSingleKeyPrice function.
*/
exports.getSingleKeyPriceAsync = function(key) {
  return Q.Promise(function(resolve, reject) {
    exports.getSingleKeyPrice(key, function(err, result) {
      if (err) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};
