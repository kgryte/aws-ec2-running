'use strict';

// MODULES //

var filter = require( './filter.js' );


// RESPONSE //

/**
* FUNCTION: response( rid, done )
*	Returns a callback to be invoked upon receiving a response.
*
* @param {Number} rid - request id
* @param {Function} done - callback invoked after processing the endpoint response
* @returns {Function}response handler
*/
function response( rid, done ) {
	/**
	* FUNCTION: onResponse( error, data )
	*	Callback invoked upon receiving a response from an endpoint.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Object} data - response data
	*/
	return function onResponse( error, data ) {
		var evt;
		evt = {
			'rid': rid,
			'time': Date.now()
		};
		if ( error ) {
			evt.status = 500;
			evt.message = 'Request error. Error encountered while attempting to query the endpoint.';
			evt.detail = error;
			return done( evt );
		}
		evt.data = filter( data );
		done( null, evt );
	}; // end FUNCTION onResponse()
} // end FUNCTION response()


// EXPORTS //

module.exports = response;
