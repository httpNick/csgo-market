/**
* Contains methods to be used to generate market hash names.
*/

var stattrackString = "StatTrak™";
var starString = "★";
var foilString = "(Foil)";
var stickerString = "Sticker |";
var keyString = "Case Key";

/**
 * Helper method to format URL for weapon request.
 */
exports.gunHash = function (wep, skin, wear, stattrak) {
  var url = '';
  if (stattrak) {
    url += stattrackString + ' ';
  }
  return url + wep + ' | ' + skin + ' (' + wear + ')';
};

/**
* Helper method to format URL for knife request.
*/
exports.knifeHash = function(knife, skin, wear, stattrak) {
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
};

/**
* Helper method to format URL for sticker request.
*/
exports.stickerHash = function(stickerName, foil) {
  if (foil) {
    if (stickerName.indexOf('|') === -1) {
      // This is a regular foil sticker. Ex: 'Sticker | Robo (Foil)'
      return stickerString
        + ' ' + stickerName
        + ' ' + foilString;
    } else {
      /*
      * This is a player sticker with foil.
      * Split the name and event/year up into two parts.
      * Ex: 'Sticker | kennyS (Foil) | Cologne 2015'
      */
      var splitStickerName = stickerName.split(' | ');
      return stickerString
        + ' ' + splitStickerName[0]
        + ' ' + foilString
        + ' | '
        + splitStickerName[1];
    }
  } else {
    // This is a regular sticker with no foil. Ex: 'Sticker | Robo'
    return stickerString
      + ' ' + stickerName;
  }
};

/**
* Helper method to format URL for key request.
*/
exports.keyHash = function(key) {
  return key
    + ' ' +
    keyString;
}
