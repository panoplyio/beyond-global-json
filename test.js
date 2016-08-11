var assert = require( 'assert' );
var parseBig = require( './index' );

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

describe( 'Global JSON Override', function () {
    it( 'throws an error for unparsable strings', function ( done ) {
        var parsed;
        var badJsonString = '{"name":"somename}';

        try {
            var parsed = JSON.parse( badJsonString );
        } catch ( err ) {
            // the json-bigint library gives a different error
            // message than the global JSON object
            assert.equal( err.message, 'Bad string' );
            assert.equal( err.name, 'SyntaxError' )
            done();
        }

        if ( parsed ) {
            var err = new Error( 'Parsing should have failed.' );
        }
    })

    it( 'parses numbers beyond the safe integer limits', function ( done ) {
        var addedDigit = '1';
        var values = [ MAX_SAFE_INTEGER, MIN_SAFE_INTEGER ];

        // Construct an array of values to test. Each value
        // is concatenated with an extra digit, then parsed.
        var testedValues = [].map.call( values, function ( val ) {
            var tested = val.toString().concat( addedDigit );
            return JSON.parse( tested );
        })

        testedValues.forEach( function ( val ) {
            var lastDigit = val[ val.length - 1 ];

            // we want to test that while the module is
            // required, it wouldn't use JSON.parse to
            // round our values when they're bigger than
            // Number.MAX_SAFE_INTEGER or smaller
            // than Number.MIN_SAFE_INTEGER
            assert.equal( lastDigit, addedDigit )
        })

        done();
    })

    it( 'does not parse big numbers to objects', function ( done ) {
        var values = [ MAX_SAFE_INTEGER, MIN_SAFE_INTEGER ];

        // Construct an array of values to test. Each value is parsed
        var testedValues = [].map.call( values, function ( val ) {
            val = val.toString();
            return JSON.parse( val );
        })

        // expected type
        var expected = 'string';
        testedValues.forEach( function ( val ) {

            // When 'storeAsString' configured as true, it sohuld parse
            // the big integers to strings and not to object representation
            // of big numbers.
            var type = typeof val;
            assert.equal( type, expected );
        })

        done();
    })
});
