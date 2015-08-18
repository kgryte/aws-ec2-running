'use strict';

var createQuery = require( './../lib' );

var opts = {
	'key': '<your_key_id_goes_here>', // INSERT KEY HERE //
	'secret': '<your_secret_goes_here>', // INSERT SECRET HERE //
	'interval': 10000
};

/**
* FUNCTION: onError( evt )
*	Event listener invoked when a query instance emits an `error`.
*
* @param {Object} evt - error event object
*/
function onError( evt ) {
	console.error( evt );
}

/**
* FUNCTION: onData( evt )
*	Event listener invoked when data has been received.
*
* @param {Object} evt - event object
*/
function onData( evt ) {
	console.log( evt.data );
}

/**
* FUNCTION: onEnd( evt )
*	Event listener invoked when a query ends.
*
* @param {Object} evt - end event object
*/
function onEnd( evt ) {
	console.log( 'Query %d ended...', evt.rid );
}

var query = createQuery( opts );
query.on( 'error', onError );
query.on( 'data', onData );
query.on( 'end', onEnd );

// Stop polling after 60 seconds...
setTimeout( function stop() {
	query.stop();
}, 60000 );
