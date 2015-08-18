'use strict';

// MODULES //

var query = require( './query.js' );


// POLL //

/**
* FUNCTION: poll( ctx )
*	Encloses a context and returns a callback to be invoked by `setInterval`.
*
* @param {Object} ctx - function context
* @returns {Function} callback to be invoked by `setInterval`
*/
function poll( ctx ) {
	/**
	* FUNCTION: poll()
	*	Callback invoked by `setInterval` in order to poll an endpoint.
	*
	* @private
	*/
	return function poll() {
		query.call( ctx );
	}; // end FUNCTION poll()
} // end FUNCTION poll()


// EXPORTS //

module.exports = poll;
