# CSGO-Market

## Simplified CSGO skin pricing API

### Straight from Steam's community market

Use case:

```js
var csgomarket = require('csgo-market');

csgomarket.getSinglePrice('AK-47', 'Vulcan', 'Factory New', null, function (err, data) {

  if (err) {
    console.error('ERROR', err);
  } else {
    console.log(data);
  }

});
```

Example output from above code (prices will always return in USD):

```json
{
  "success": true,
  "lowest_price": "&#36;80.50",
  "volume": "48",
  "median_price": "&#36;80.01",
  "wep": "AK-47",
  "skin": "Vulcan",
  "wear": "Factory New",
  "stattrak": false
}
```
- Lowest price: *$80.50*
- Median price: *$80.01*
- *48* sold/bought on the market

## Methods

### getSinglePrice(wep, skin, wear, stattrak, callback)

- **wep**: Name of the weapon to be requested. Ex: `'AK-47'`.
- **skin**: Name of the skin to be requested. Ex: `'Vulcan'`.
- **wear**: Wear of the skin to be requested. These options are available: `Factory New`, `Minimal Wear`, `Field-Tested`, `Well-Worn`, and `Battle-Scarred`. Defaults to `'Field-Tested'` but a Levenshtein distance will be used to ensure a match.
- **stattrak**: Boolean which signifies if you want StatTrak to be included in the request or not. Defaults to `false`
- **callback**: Callback function which returns the request data. `function(err, data)`.

Returns data from the Steam market to `callback` with 2 arguments `(err, data)` where `data` is the response.

### getSingleKnifePrice(knife, skin, wear, stattrak, callback)
- **knife**: Name of the knife to be requested. Ex: `'Karambit'`.
- **skin**: Name of the skin to be requested. Ex: `'Crimson Web'`. `Note:` If skin is set to `null` then it will request the version of the Knife with no skin. [example of a knife with no skin](http://steamcommunity.com/market/listings/730/★%20Karambit)
- **wear**: Wear of the skin to be requested. These options are available: `Factory New`, `Minimal Wear`, `Field-Tested`, `Well-Worn`, and `Battle-Scarred`. Defaults to `'Field-Tested'` but a Levenshtein distance will be used to ensure a match. `Note:` If skin is set to `null` wear will also be set to `null`.
- **stattrak**: Boolean which signifies if you want StatTrak to be included in the request or not. Defaults to `false`
- **callback**: Callback function which returns the request data. `function(err, data)`.

Returns data from the Steam market to `callback` with 2 arguments `(err, data)` where `data` is the response.

### getSingleStickerPrice(stickerName, foil, callback)

- **stickerName**: Name of the Sticker to be requested
                   Note: Do not include the initial `'Sticker | '` infront of the sticker name.
                         Also, do not include `'(Foil)'` within the name.
                   Ex: `'Robo'` or `'kennyS | Cologne 2015'`.
- **foil**: Boolean which signifies if you want the (Foil) option included in the request.
            Note: Not all stickers have foil counterparts.
- **callback**: Callback function which returns the request data. `function(err, data)`.

Returns data from the Steam market to `callback` with 2 arguments `(err, data)` where `data` is the response.

## Asyncrhonous Methods

### getSinglePriceAsync(wep, skin, wear, statrak)

Same parameters minus the callback as the non-async version.
Promisified version of the getSinglePrice method (Example usage below).

### getSingleKnifePriceAsync(knife, skin, wear, stattrak)

Same parameters minus the callback as the non-async version.
Promisified version of the getSingleKnifePrice method.

### getSingleStickerPriceAsync(stickerName, foil)

Same parameters minus the callback as the non-async version.
Promisified version of the getSingleStickerPrice method.

### Use case:

```js
var csgomarket = require('csgo-market');
var Q = require('q');

var wears = ['Factory New', 'Minimal Wear',
  'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

var data = {
  prices : [{
    weapon : "AWP",
    cached : false,
    skins : ['Asiimov', 'BOOM', 'Man-o\'-war'],
    skinData : {}
  }]
}

var getPrice = function(theData) {
  var promises = [];
  theData.skins.forEach(function(skin) {
    theData.skinData[skin] = {};
    wears.forEach(function(wear) {
      promises.push(csgomarket.getSinglePriceAsync(theData.weapon, skin, wear, false).then(function(data) {
        theData.skinData[skin][wear] = data;
      }));
    });
  });
  return Q.allSettled(promises).then(function() {
    return theData;
  });
}

getPrice(data.prices[0]).then(function(results) {
  // Do something with returned results here.
})
```


### NOTE:
Capitalization is important for passed in values. If you are unsure of the exact name/spelling/capitilization/punctuation of a weapon and/or skin I highly recommend checking the [community market as a reference](http://steamcommunity.com/market/).


### Main goals to add in the near future:
- Method for all wears given a particular gun and skin or knife and skin.

This module is still under-development and this is just the first iteration.

If you have any suggestions I am open to add additional functionality! I'd like to keep it small, but I'd love feedback. Email me at nick.b.duncan@gmail.com
