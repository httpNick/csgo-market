# CSGO-Market

## Simplified CSGO skin pricing API

### Straight from Steam's community market

Use case:

```js
var csgomarket = require('csgo-market');

csgomarket.getSinglePrice("AK-47", "Vulcan", "Factory New", null, function(err, data) {
		
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


### getSinglePrice(wep, skin, wear, stattrak, callback)

- **wep**: Name of the weapon to be requested. Ex: `"AK-47"`
- **skin**: Name of the skin to be requested. Ex: `"Vulcan"`
- **wear**: Wear of the skin to be requested. These options are available: `Factory New`, `Minimal Wear`, `Field-Tested`, `Well-Worn`, and `Battle-Scarred`. Defaults to `"Field-Tested"` but a Levenshtein distance will be used to ensure a match
- **stattrak**: Boolean which signifies if you want StatTrak to be included in the request or not. Defaults to `false`
- **callback**: Callback function which returns the request data. `function(err, data)`

Returns data from the Steam market to `callback` with 2 arguments `(err, data)` where `data` is the response.


### NOTE:
Capitalization is important for passed in values. If you are unsure of the exact name/spelling/capitilization/punctuation of a weapon and/or skin I highly recommend checking the [community market as a reference](http://steamcommunity.com/market/).


### Main goals to add in the near future:
- Method for Knife pricing
- Method for all wears given a particular gun and skin.

This module is still under-development and this is just the first iteration. 

If you have any suggestions I am open to add additional functionality! I'd like to keep it small, but I'd love feedback. Email me at nick.b.duncan@gmail.com
