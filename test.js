var assert = require( 'assert' );
var Promise = require( 'bluebird' );
var parseBig = require( './index' );

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

describe( 'Parse Big', function () {
    it( 'response with bigint library error', function ( done ) {
        var badJsonString = '{"name":"somename}';

        Promise.resolve( badJsonString )
            .then( parse )
            .catch( function ( err ) {
                // the json-bigint library gives a different error
                // message than the global JSON object
                assert.equal( err.message, 'Bad string');
                assert.equal( err.name, 'SyntaxError');
                done();
            })
    })
    
});

/**
 * Parse a given input
 *
 * @param {String} input - given input
 * @return {Mixed} returns the parsed object
 */
function parse ( input ) {
    return JSON.parse( input );
}
