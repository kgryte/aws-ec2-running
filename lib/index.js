'use strict';

// MODULES //

var EventEmitter = require( 'events' ).EventEmitter,
	AWS = require( 'aws-sdk' ),
	copy = require( 'utils-copy' ),
	isPositive = require( 'validate.io-positive' ),
	validate = require( './validate.js' ),
	query = require( './query.js' ),
	poll = require( './poll.js' );


// VARIABLES //

var DEFAULTS = require( './defaults.json' ),
	VERSION = '2015-04-15', // AWS API version
	INTERVAL = 5 * 60 * 1000; // 5 min in milliseconds


// QUERY //

/**
* FUNCTION: Query( opts )
*	Query constructor.
*
* @constructor
* @param {Object} opts - constructor options
* @param {String} opts.key - access key
* @param {String} opts.secret - access secret
* @param {Number} [opts.interval=300000] - defines a poll interval (in milliseconds) for repeatedly querying an endpoint
* @param {Object[]} [opts.tags] - instance tags
* @returns {Query} Query instance
*/
function Query( options ) {
	var self,
		opts,
		poll,
		err;

	if ( !arguments.length ) {
		throw new Error( 'insufficient input arguments. Must provide an options object.' );
	}
	if ( !(this instanceof Query) ) {
		return new Query( options );
	}
	self = this;

	// Make the Query instance an event emitter:
	EventEmitter.call( this );

	// Validate input options...
	opts = copy( DEFAULTS );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	if ( opts.interval ) {
		poll = true;
		this._interval = opts.interval;
		delete opts.interval;
	} else {
		this._interval = INTERVAL;
	}
	// Create a new client:
	AWS.config.update({
		'accessKeyId': opts.key,
		'secretAccessKey': opts.secret,
		'region': opts.region
	});
	this._client = new AWS.EC2({
		'apiVersion': VERSION
	});

	// Cache the options:
	delete opts.key;
	delete opts.secret;
	delete opts.region;
	this._opts = opts;

	// Expose a property for setting and getting the interval...
	Object.defineProperty( this, 'interval', {
		'set': function set( val ) {
			var err;
			if ( !isPositive( val ) ) {
				err = new TypeError( 'invalid value. `interval` must be a positive number. Value: `' + val + '`.' );
				return this.emit( 'error', err );
			}
			this._interval = val;

			// Start polling the endpoint:
			this.start();
		},
		'get': function get() {
			return this._interval;
		},
		'configurable': false,
		'enumerable': true
	});

	// Expose a property for determining if any requests are pending...
	Object.defineProperty( this, 'pending', {
		'get': function get() {
			return this._pending;
		},
		'configurable': false,
		'enumerable': true
	});
	this._pending = 0;

	// Initialize a request cache which is used to track pending requests:
	this._cache = {};

	// Initialize a request count (used for assigning request ids):
	this._rid = 0;

	// Add event listeners to keep track of pending queries...
	this.on( 'init', init );
	this.on( 'end', end );

	// [Start querying the endpoint on the next tick...
	if ( poll ) {
		setTimeout( start, 0 );
	} else {
		setTimeout( request, 0 );
	}
	return this;

	/**
	* FUNCTION: init( evt )
	*	Event listener invoked when a query is to begin querying an endpoint.
	*
	* @private
	* @param {Object} evt - init event object
	*/
	function init( evt ) {
		self._cache[ evt.rid ] = true;
		self._pending += 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION init()

	/**
	* FUNCTION: end( evt )
	*	Event listener invoked when a query ends.
	*
	* @private
	* @param {Object} evt - end event object
	*/
	function end( evt ) {
		delete self._cache[ evt.rid ];
		self._pending -= 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION end()

	/**
	* FUNCTION: start()
	*	Starts polling an endpoint.
	*
	* @private
	*/
	function start() {
		self.start();
	} // end FUNCTION start()

	/**
	* FUNCTION: request()
	*	Makes a single query request to an endpoint.
	*
	* @private
	*/
	function request() {
		self.query();
	} // end FUNCTION request()
} // end FUNCTION Query()

/**
* Create a prototype which inherits from the parent prototype.
*/
Query.prototype = Object.create( EventEmitter.prototype );

/**
* Set the constructor.
*/
Query.prototype.constructor = Query;


/**
* METHOD: start()
*	Starts polling an endpoint.
*
* @returns {Query} Query instance
*/
Query.prototype.start = function() {
	// Clear any existing interval timers:
	this.stop();

	// Announce that we will be starting to poll:
	this.emit( 'start', null );

	// Make an initial request:
	this.query();

	// Create a new interval timer to continue polling...
	this._id = setInterval( poll( this ), this._interval );

	return this;
}; // end METHOD start()

/**
* METHOD: stop()
*	Stops polling an endpoint.
*
* @returns {Query} Query instance
*/
Query.prototype.stop = function() {
	if ( this._id ) {
		clearInterval( this._id );
		this._id = null;
		this.emit( 'stop', null );
	}
	return this;
}; // end METHOD stop()


/**
* METHOD: query()
*	Queries an endpoint.
*
* @returns {Query} Query instance
*/
Query.prototype.query = function() {
	query.call( this );
	return this;
}; // end METHOD query()


// EXPORTS //

module.exports = Query;
