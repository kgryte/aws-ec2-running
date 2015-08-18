'use strict';

// MODULES //

var isObject = require( 'validate.io-object' ),
	isString = require( 'validate.io-string-primitive' ),
	isPositive = require( 'validate.io-positive' ),
	isObjectArray = require( 'validate.io-object-array' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - function options
* @returns {Null|Error} null or error
*/
function validate( opts, options ) {
	var tag,
		len,
		i;
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	opts.key = options.key;
	if ( !isString( opts.key ) ) {
		return new Error( 'invalid option. Access key must be a string primitive. Option: `' + opts.key + '`.' );
	}
	opts.secret = options.secret;
	if ( !isString( opts.secret ) ) {
		return new Error( 'invalid option. Access secret must be a string primitive. Option: `' + opts.secret + '`.' );
	}
	if ( options.hasOwnProperty( 'region' ) ) {
		opts.region = options.region;
		if ( !isString( opts.region ) ) {
			return new Error( 'invalid option. Region option must be a string primitive. Option: `' + opts.region + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'interval' ) ) {
		opts.interval = options.interval;
		if ( !isPositive( opts.interval ) ) {
			return new TypeError( 'invalid option. Interval option must be a positive number. Option: `' + opts.interval + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'tags' ) ) {
		opts.tags = options.tags;
		if ( !isObjectArray( opts.tags ) ) {
			return new TypeError( 'invalid option. Tags option must be an object array. Option: `' + opts.tags + '`.' );
		}
		len = opts.tags;
		for ( i = 0; i < len; i++ ) {
			tag = opts.tags[ i ];
			if ( !tag.hasOwnProperty( 'key' ) || !tag.hasOwnProperty( 'value' ) ) {
				return new Error( 'invalid option. Each tag must have `key` and `value` properties. Option: `' + opts.tags + '`.' );
			}
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
