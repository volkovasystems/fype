/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "fype",
			"path": "fype/fype.js",
			"file": "fype.js",
			"module": "fype",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/fype.git",
			"test": "fype-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Determine if directory, file, and symbolic link.
	@end-module-documentation

	@include:
		{
			"depher": "depher",
			"falzy": "falzy",
			"fs": "fs",
			"harden": "harden",
			"kept": "kept",
			"raze": "raze",
			"zelf": "zelf"
		}
	@end-include
*/

const depher = require( "depher" );
const falzy = require( "falzy" );
const fs = require( "fs" );
const harden = require( "harden" );
const kept = require( "kept" );
const raze = require( "raze" );
const zelf = require( "zelf" );

harden( "DIRECTORY", Symbol( "directory" ) );
harden( "FILE", Symbol( "file" ) );
harden( "LINK", Symbol( "link" ) );

const fype = function fype( path, type, synchronous ){
	/*;
		@meta-configuration:
			{
				"path:required": "string",
				"type:required": [
					DIRECTORY,
					FILE,
					LINK
				],
				"synchronous": "boolean"
			}
		@end-meta-configuration
	*/

	if( falzy( path ) || typeof path != "string" ){
		throw new Error( "invalid path" );
	}

	let parameter = raze( arguments );

	type = depher( parameter, [ DIRECTORY, FILE, LINK ], FILE );

	synchronous = depher( parameter, BOOLEAN, false );

	if( synchronous ){
		try{
			if( kept( path, true ) ){
				let statistic = fs.lstatSync( path );

				if( type == DIRECTORY ){
					return statistic.isDirectory( );
				}

				if( type == FILE ){
					return statistic.isFile( );
				}

				if( type == LINK ){
					return statistic.isSymbolicLink( );
				}
			}

			return false;

		}catch( error ){
			throw new Error( `cannot get file statistic, ${ error.stack }` );
		}

	}else{
		let catcher = kept.bind( zelf( this ) )( path )
			.then( function done( error, exist ){
				if( !exist ){
					return catcher.pass( null, false );
				};

				fs.lstat( path, function done( error, statistic ){
					if( error instanceof Error ){
						return catcher.pass( new Error( `cannot get file statistic, ${ error.stack }` ), false );
					}

					if( type == DIRECTORY ){
						return catcher.pass( null, statistic.isDirectory( ) );
					}

					if( type == FILE ){
						return catcher.pass( null, statistic.isFile( ) );
					}

					if( type == LINK ){
						return catcher.pass( null, statistic.isSymbolicLink( ) );
					}

					return catcher.pass( null, false );
				} );

				return catcher;
			} );

		return catcher;
	}
};

module.exports = fype;
