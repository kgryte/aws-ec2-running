'use strict';

// MODULES //

var getParams = require( './params.js' ),
	response = require( './response.js' );


// QUERY //

/**
* FUNCTION: query()
*	Makes an HTTP request to an endpoint and emits the results.
*/
function query() {
	/* jshint validthis:true */
	var self = this,
		params,
		clbk,
		rid;

	// Create a unique request id:
	rid = ++this._rid;

	// Emit that we are ready to begin a request:
	this.emit( 'init', {
		'rid': rid
	});

	// Create a response handler:
	clbk = response( rid, onData );

	// Create the parameter object...
	params = getParams( this._opts.tags || [] );

	// Make the request:
	this._client.describeInstances( params, clbk );

	/**
	* FUNCTION: onData( error, evt )
	*	Callback invoked upon receiving an HTTP response.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Object} evt - response data
	*/
	function onData( error, evt ) {
		var data;
		if ( error ) {
			self.emit( 'error', error );
		} else {
			data = {
				'rid': rid,
				'time': evt.time,
				'data': evt.data
			};
			self.emit( 'data', data );
		}
		self.emit( 'end', {
			'rid': rid
		});
	} // end FUNCTION onData()
} // end FUNCTION query()


// EXPORTS //

module.exports = query;
