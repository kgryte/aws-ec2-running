EC2 Status: Running
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Queries [AWS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property) for running EC2 instances.


## Installation

``` bash
$ npm install aws-ec2-running
```


## Usage

``` javascript
var createQuery = require( 'aws-ec2-running' );
```

#### createQuery( opts[, clbk] )

Creates a new `Query` instance for retrieving a list of `running` EC2 instances from [AWS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property).

``` javascript
var opts = {
	'key': 'XXXXXXXXXXXXXXXXXX',
	'secret': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'	
};

var query = createQuery( opts );
query.on( 'data', onData );

function onData( evt ) {
	console.log( evt.data );
	// returns ['<instance_id>','<instance_id>',...]
}
```

A callback `function` may be provided which accepts two arguments: `error` and `data`. When a request is successful, `error` is `null`.

``` javascript
var opts = {
	'key': 'XXXXXXXXXXXXXXXXXX',
	'secret': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'	
};

var query = createQuery( opts, onData );

function onData( error, data ) {
	if ( error ) {
		throw error;
	}
	console.log( data );
	// returns ['<instance_id>','<instance_id>',...]
}
```

The `constructor` accepts the following options:

-	__region__: AWS region. Default: `'us-east-1'`.
-	__tags__: `object array` specifying EC2 instance tags by which to filter running instances. Each `object` should consist of `key` and `value` properties, where `key` is the tag and `value` is the tag value.
	``` javascript
	var opts = {
		'key': 'XXXXXXXXXXXXXXXXXX',
		'secret': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		'tags': [
			{
				'key': 'app',
				'value': 'amazing_app'
			},
			...
		]
	};

	// Return only those running instances having the `app` tag with a value `amazing_app`...
	var query = createQuery( opts );
	query.on( 'data', onData );

	function onData( evt ) {
		console.log( evt.data );
		// returns ['<id>','<id>',...]
	}
	```

-	__interval__: positive `number` defining a poll [interval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) for repeatedly querying AWS. The interval should be in units of `milliseconds`. If an `interval` is __not__ provided, only a single query is made. Default: `300000` (5min).

	``` javascript
	var opts = {
		'key': 'XXXXXXXXXXXXXXXXXX',
		'secret': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		'interval': 3600000 // 1hr
	};

	// Every hour, fetch the list of running EC2 instances...
	var query = createQuery( opts );
	query.on( 'data', onData );

	function onData( evt ) {
		console.log( evt.data );
		// returns ['<id>','<id>',...]
	}
	```


===
### Attributes

A `Query` instance has the following attributes...


#### query.interval

Attribute defining a poll [interval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) for repeatedly querying AWS. An `interval` should be in units of `milliseconds`. Default: `300000` (5min).

``` javascript
query.interval = 60000; // 1 minute
```

Once set, a `Query` instance immediately begins polling AWS according to the specified `interval`.


#### query.pending

__Read-only__ attribute providing the number of pending requests.

``` javascript
if ( query.pending ) {
	console.log( '%d requests still pending...', query.pending );
}
```


===
### Methods

A `Query` instance has the following methods...

#### query.query()

Instructs a `Query` instance to perform a single query.

``` javascript
query.query();
```

This method is useful when manually polling AWS (i.e., no fixed `interval`).


#### query.start()

Instructs a `Query` instance to start polling AWS. 

``` javascript
query.start();
```


#### query.stop()

Instructs a `Query` instance to stop polling AWS.

``` javascript
query.stop();
```

__Note__: pending requests are still allowed to complete. 


===
### Events

A `Query` instance emits the following events...


#### 'error'

A `Query` instance emits an `error` event whenever a non-fatal error occurs; e.g., an invalid value is assigned to an attribute, AWS query errors, etc. To capture `errors`,

``` javascript
function onError( evt ) {
	console.error( evt );
}

query.on( 'error', onError );
```

#### 'init'

A `Query` instance emits an `init` event prior to querying AWS. Each query is assigned a unique identifier, which is emitted during this event.

``` javascript
function onInit( evt ) {
	console.log( evt.rid );
}

query.on( 'init', onInit );
```

Listening to this event can be useful for query monitoring.



#### 'data'

A `Query` instance emits a `data` event after processing all query data. For queries involving pagination, all data is concatenated into a single `array`.

``` javascript
function onData( evt ) {
	console.log( evt.data );
}

query.on( 'data', onData );
```


#### 'end'

A `Query` instance emits an `end` event once a query is finished processing requests.

``` javascript
function onEnd( evt ) {
	console.log( 'Query %d end...', evt.rid );
}

query.on( 'end', onEnd );
```


#### 'pending'

A `Query` instance emits a `pending` event anytime the number of pending requests changes. Listening to this event could be useful when wanting to gracefully end a `Query` instance (e.g., allow all pending requests to finish before killing a process).

``` javascript
function onPending( count ) {
	console.log( '%d pending requests...', count );
}

query.on( 'pending', onPending );
```


#### 'start'

A `Query` instance emits a `start` event immediately before creating a new interval timer and starting to poll AWS.

``` javascript
function onStart() {
	console.log( 'Polling has begun...' );
}

query.on( 'start', onStart );
```


#### 'stop'

A `Query` instance emits a `stop` event when it stops polling AWS.

``` javascript
function onStop() {
	console.log( 'Polling has ended...' );
}

query.on( 'stop', onStop );
```

__Note__: pending requests may result in `data` and other associated events being emitted __after__ a `stop` event occurs.




## Examples

``` javascript
var createQuery = require( 'aws-ec2-running' );

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
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g aws-ec2-running
```


### Usage

``` bash
Usage: aws-ec2-running [options]

Options:

  -h,    --help                Print this message.
  -V,    --version             Print the package version.
         --key [key]           AWS credentials key id.
         --secret [secret]     AWS credentials secret.
         --interval [ms]       Poll interval (in milliseconds).
         --tag [key=value]     EC2 instance tag; e.g., 'beep=boop bop'.
         --region [region]     AWS region. Default: 'us-east-1'.
```

### Notes

*	In addition to the command-line `key` and `secret` options, the `key` and `secret` options may be specified via environment variables: `AWS_ACCESS_KEY` and `AWS_ACCESS_SECRET`. The command-line options __always__ take precedence.
*	If the process receives a terminating [signal event](https://nodejs.org/api/process.html#process_signal_events) (e.g., `CTRL+C`) while polling AWS, the process will stop polling and wait for any pending requests to complete before exiting.
*	Multiple `tags` are supported. Key-value pairs should be separated by an `=` symbol. Keys are assumed to be free of any `=` symbols.

	``` bash
	$ aws-ec2-running --key <key> --secret <secret> --tag 'beep=boop' --tag 'woot=be bop'
	```


### Examples

Setting credentials using the command-line option:

``` bash
$ aws-ec2-running --key <key> --secret <secret>
# => '[<id>,<id>,...]'
```

Setting credentials using environment variables:

``` bash
$ AWS_ACCESS_KEY=<key> AWS_ACCESS_SECRET=<secret> aws-ec2-running
# => '[<id>,<id>,...]'
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ ./node_modules/.bin/aws-ec2-running --key <key> --secret <secret>
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ node ./bin/cli --key <key> --secret <secret>
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/aws-ec2-running.svg
[npm-url]: https://npmjs.org/package/aws-ec2-running

[travis-image]: http://img.shields.io/travis/kgryte/aws-ec2-running/master.svg
[travis-url]: https://travis-ci.org/kgryte/aws-ec2-running

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/aws-ec2-running/master.svg
[codecov-url]: https://codecov.io/github/kgryte/aws-ec2-running?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/aws-ec2-running.svg
[dependencies-url]: https://david-dm.org/kgryte/aws-ec2-running

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/aws-ec2-running.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/aws-ec2-running

[github-issues-image]: http://img.shields.io/github/issues/kgryte/aws-ec2-running.svg
[github-issues-url]: https://github.com/kgryte/aws-ec2-running/issues
