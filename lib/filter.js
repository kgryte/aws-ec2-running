'use strict';

/**
* FUNCTION: filter( data )
*	Filters response data and returns a list of instance ids.
*
* @param {Object} data - response data
* @returns {String[]} instance ids
*/
function filter( data ) {
	var out,
		res,
		arr,
		m, n,
		i, j;

	out = [];
	res = data.Reservations;
	m = res.length;
	for ( i = 0; i < m; i++ ) {
		arr = res[ i ].Instances;
		n = arr.length;
		for ( j = 0; j < n; j++ ) {
			out.push( arr[ j ].InstanceId );
		}
	}
	return out;
} // end FUNCTION filter()


// EXPORTS //

module.exports = filter;
