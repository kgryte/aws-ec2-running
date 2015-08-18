'use strict';

/**
* FUNCTION: params( tags )
*	Returns a filter object provided an array of tags.
*
* @param {Object[]} tags - tag array
* @returns {Object} parameter object
*/
function params( tags ) {
	var out = {},
		arr,
		len,
		i;

	len = tags.length;
	arr = new Array( len+1 );

	arr[ 0 ] = {
		'Name': 'instance-state-name',
		'Values': [
			'running'
		]
	};
	for ( i = 0; i < len; i++ ) {
		arr.push({
			'Name': 'tag:' + tags[ i ].key,
			'Values': [
				tags[ i ].value
			]
		});
	}
	out.Filters = arr;
	return out;
} // end FUNCTION params()


// EXPORTS //

module.exports = params;
