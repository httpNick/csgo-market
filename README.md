# CSGO-Market - Simplified CSGO skin pricing API

## Straight from Steam's community market

Use case:

```js
var csgomarket = require('csgo-market');

var printIt = function(data) {
	console.log(data);
}
csgomarket.getSinglePrice("AK-47", "Vulcan", "Factory New", false, printIt);
```

Example output from above code (prices will always return in USD): 

```js
{ success: true,
  lowest_price: '&#36;80.50',
  volume: '48',
  median_price: '&#36;80.01',
  wep: "AK-47",
  skin: "Vulcan",
  wear: "Factory New",
  stattrak: "false" }
```
(lowest price: $80.50, median_price: $80.01, 48 on the market.)


## getSinglePrice(wep, skin, wear, stattrak, callback)

### sends returned json object from steam to the callback function. If the request failed for any reason the json object will hold the following: {success: false}.

- 'wep' : name of the weapon to be requested. 
- 'skin' : name of the skin to be requested.
- 'wear' : wear of the skin to be requested. Available are these options: Field-Tested, Minimal Wear, Well-Worn, Battle-Scarred
- 'stattrak' : boolean which signifies if you want stattrak to be included in the request or not.
- 'callback' : callback function. Must have a single parameter which is the data returned from the request.

### NOTE:
Capitialization is important for passed in values. If you are unsure of the exact name/spelling/capitilization/punctuation of a weapon and/or skin I highly reccomend checking the community market as a reference (http://steamcommunity.com/market/)



### Main goals to add in the near future:
- Function for Knife pricing
- Function for all wears given a particular gun/skin pair.

This module is still under-development and this is just the first iteration. 

If you have any suggestions I am open to add additonal functionality! I'd like to keep it small, but i'd love feedback. Email me @ nick.b.duncan@gmail.com