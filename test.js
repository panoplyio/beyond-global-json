require( 'sugar' );
var assert = require( 'assert' );
var Promise = require( 'bluebird' );
var parseBig = require( './index' );

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

describe( 'Parse Big', function () {
    it( 'error', function ( done ) {
        var badJsonString = '{"name":"somename}';

        Promise.resolve( badJsonString )
            .then( JSON.parse )
            .catch( function ( err ) {
                // the json-bigint library gives a different error
                // message than the global JSON object
                assert.equal( err.message, 'Bad string');
                assert.equal( err.name, 'SyntaxError');
                done();
            })
    })

    it( 'parse', function ( done ) {
        var addedDigit = '1';
        var values = [ MAX_SAFE_INTEGER, MIN_SAFE_INTEGER ];

        // add another digit for each tested value
        values = values.map( function ( val ) {
            return val.toString().concat( addedDigit );
        })

        var results = [];
        Promise.resolve( values )
            .each( function ( val ) {
                var parsed = JSON.parse( val );
                results.push( parsed );
            })
            .return( results )
            .each( function ( result ) {
                result = new String( result );
                var lastDigit = result[ result.length - 1 ];

                // we want to test that while the module is
                // required, it wouldn't use JSON.parse to
                // round our values when they're bigger than
                // Number.MAX_SAFE_INTEGER or smaller
                // than Number.MIN_SAFE_INTEGER
                assert.equal( lastDigit, addedDigit )
            })
            .then( function () {
                done();
            })
            .catch( function ( err ) {
                done( err );
            })
    })
});
