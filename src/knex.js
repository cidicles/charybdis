export default require( 'knex' )( {
	client: 'mysql',
	connection: {
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'charybdis',
		charset: 'utf8',
	}
} );
