/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	createQuery = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'aws-ec2-running', function tests() {

	it( 'should export a function', function test() {
		expect( createQuery ).to.be.a( 'function' );
	});

});
