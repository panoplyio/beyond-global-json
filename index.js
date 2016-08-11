/*
This module overrides the 'parse' and 'stringify' methods for
the global JSON object, to handle parsing of large numbers.
This is due to the fact the Javascript uses floating numbers to
store all numbers. Therefore, past a certain point (Number.MAX_SAFE_INTEGER),
integers will be incorrect due to the floating point percision.
 */

// We want to convert all BigInts to be-and-stay strings, so it would not
// 'parse' big numbers values to objects representation
var STORE_AS_STRING = true;

var JSONbigInt = require( 'json-bigint' )({
    storeAsString: STORE_AS_STRING
});

module.exports = override();

/**
 * Overrides the global JSON methods
 */
function override () {
    JSON.parse = JSONbigInt.parse;
    JSON.stringify = JSONbigInt.stringify;
}
