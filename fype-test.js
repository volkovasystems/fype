
const assert = require( "assert" );
const fype = require( "./fype.js" );

assert.equal( fype( "./package.json", FILE, true ), true, "should be true" );

assert.equal( fype( "./.git", DIRECTORY, true ), true, "should be true" );

fype( "./package.json", FILE )( function done( error, result ){
	assert.equal( result, true, "should be true" );

	console.log( "ok" );
} );

fype( "./.git", DIRECTORY )( function done( error, result ){
	assert.equal( result, true, "should be true" );

	console.log( "ok" );
} );
