let figlet = require( 'figlet' );
let _ = require( 'lodash' );
var fs = require( 'fs' );

let phrase = [
  'charybdis'
];

let font = [
  'Invita'
];

figlet.text( _.sample( phrase ), {
	font: _.sample( font )
}, function ( err, data ) {
	if ( err ) {
		console.log( 'Figlet broke.' );
		console.dir( err );
		return;
	}
	console.log( data );
} );
