var assert = require( 'assert' );
var BigNumber = require( 'bignumber.js' );

var parseBig = require( './index' );

// json-bigint uses bignumber.js to check whether the number is
// bigger than 15 digits to determine if it should be set as a
// string (or 'BigNumber', in case `storeAsString` is configured false
// to parse big integers as BigNumber objects).
var MAX_NUMBER_LENGTH = 15;

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
        }

        if ( parsed ) {
            var err = new Error( 'Parsing should have failed.' );
            done ( err );
        } else {
            done();
        }
    })

    it( 'does not lose precision for parsing unsafe integers', function ( done ) {
        var max = new BigNumber( MAX_SAFE_INTEGER );
        var min = new BigNumber( MIN_SAFE_INTEGER );

        // JSON.parse round odd numbers to evens, so we want
        // to test values such as Number.MAX_SAFE_INTEGER + 2,
        // which result in 9007199254740993. Same goes decimal values.
        var values = [
            max.plus( 2 ),
            max.plus( 0.1 ),
            max.plus( 0.9 ),
            min.minus( 2 ),
            min.minus( 0.1 ),
            min.minus( 0.9 )
        ];

        // Construct an array of values to test. Each value
        // is stringifed, then parsed
        var testedValues = [].map.call( values, function ( val ) {
            var tested = val.toString();
            return JSON.parse( tested );
        })

        var i;
        for ( i = 0; i < testedValues.length; i += 1 ) {
            var originalValue = values[ i ].toString();
            var parsedValue = testedValues[ i ];

            // When 'storeAsString' configured as true, it sohuld parse
            // the big integers to strings and not to object representation
            // of big numbers.
            assert( typeof parsedValue === 'string' );

            // we want to test that numbers beyond the safe range, that
            // are prone to precision lost with the global JSON
            // object, are parsed correctly while the module is
            // required
            assert.equal( parsedValue, originalValue );
        }

        if ( i !== values.length ) {
            var err = new Error( 'Not all values were tested.' )
            done( err );
        } else {
            done();
        }
    })

    it( 'parses safe integers to numbers', function ( done ) {
        var values = [
            MAX_SAFE_INTEGER,
            MIN_SAFE_INTEGER
        ]

        // Construct an array of values to test. Each value is
        // stringified, then parsed
        var testedValues = [].map.call( values, function ( val ) {
            val = val.toString();

            // We want to make sure that the tested values are indeed
            // less than 15 digits (MAX_NUMBER_LENGTH) so we can test
            // if they are parsed as numbers
            if ( val.length > MAX_NUMBER_LENGTH ) {
                val = val.slice( 0, MAX_NUMBER_LENGTH );
            }

            return JSON.parse( val );
        })

        testedValues.forEach( function ( val ) {
            assert( typeof val === 'number' );
        })

        done();
    })
});
