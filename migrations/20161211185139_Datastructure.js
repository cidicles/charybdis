exports.up = function ( knex, Promise ) {
	return knex.schema.createTable( 'users', function ( usersTable ) {
			// Primary Key
			usersTable.increments();
			// Data
			usersTable.string( 'name', 50 )
				.notNullable();
			usersTable.string( 'username', 50 )
				.notNullable()
				.unique();
			usersTable.string( 'email', 250 )
				.notNullable()
				.unique();
			usersTable.string( 'password', 128 )
				.notNullable();
			usersTable.string( 'guid', 50 )
				.notNullable()
				.unique();
			usersTable.timestamp( 'created_at' )
				.notNullable();
		} )
		.createTable( 'posts', function ( pt ) {
			// Primary Key
			pt.increments();
			pt.string( 'owner', 36 )
				.references( 'guid' )
				.inTable( 'users' );
			// Data
			pt.string( 'name', 250 )
				.notNullable();
			pt.string( 'picture_url', 250 )
				.notNullable();
			pt.string( 'guid', 36 )
				.notNullable()
				.unique();
			pt.boolean( 'isPublic' )
				.notNullable()
				.defaultTo( true );
			pt.timestamp( 'created_at' )
				.notNullable();
		} );
};
exports.down = function ( knex, Promise ) {
	return knex.schema.dropTableIfExists( 'posts' )
		.dropTableIfExists( 'users' );
};
