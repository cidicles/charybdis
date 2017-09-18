import Knex from './knex';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid';
const routes = [
	{
		path: '/posts/{postGuid}',
		method: 'GET',
		handler: ( request, reply ) => {
			const { postGuid } = request.params;
			console.log(postGuid);
			const getOperation = Knex( 'posts' ).where( {
				isPublic: true,
				guid: postGuid
			} ).select( 'name', 'picture_url' ).then( ( results ) => {
				if ( !results || results.length === 0 ) {
					reply( {
						posts,
						error: true,
						errMessage: 'no public posts found',
					} );
				}
				reply( {
					dataCount: results.length,
					data: results,
				} );
			} ).catch( ( err ) => {
				reply( 'server-side error' + err );
			} );
		}
},
	{
		path: '/posts',
		method: 'GET',
		handler: ( request, reply ) => {
			const getOperation = Knex( 'posts' ).where( {
				isPublic: true
			} ).select( 'name', 'picture_url', 'guid' ).then( ( results ) => {
				if ( !results || results.length === 0 ) {
					reply( {
						posts,
						error: true,
						errMessage: 'no public posts found',
					} );
				}
				reply( {
					dataCount: results.length,
					data: results,
				} );
			} ).catch( ( err ) => {
				reply( 'server-side error' );
			} );
		}
},
	{
		path: '/auth',
		method: 'POST',
		handler: ( request, reply ) => {
			const {
				username,
				password
			} = request.payload;
			const getOperation = Knex( 'users' ).where( {
				username,
			} ).select( 'password', 'guid' ).then( ( [ user ] ) => {
				if ( !user ) {
					reply( {
						error: true,
						errMessage: 'the specified user was not found',
					} );
					return;
				}
				if ( user.password === password ) {
					const token = jwt.sign( {
						username,
						scope: user.guid,
					}, 'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy', {
						algorithm: 'HS256',
						expiresIn: '1h',
					} );
					reply( {
						token,
						scope: user.guid,
					} );
				} else {
					reply( 'incorrect password' );
				}
			} ).catch( ( err ) => {
				reply( 'server-side error' );
			} );
		}
	},
	{
		path: '/posts',
		method: 'POST',
		config: {
			auth: {
				strategy: 'token',
			}
		},
		handler: ( request, reply ) => {
			const {
				post
			} = request.payload;
			const guid = GUID.v4();
			const insertOperation = Knex( 'posts' ).insert( {
				owner: request.auth.credentials.scope,
				name: post.name,
				picture_url: post.picture_url,
				guid,
			} ).then( ( res ) => {
				reply( {
					data: guid,
					message: 'successfully created post'
				} );
			} ).catch( ( err ) => {
				reply( 'server-side error' );
			} );
		}
	},
	{
		path: '/posts/{postGuid}',
		method: 'PUT',
		config: {
			auth: {
				strategy: 'token',
			},
			pre: [
				{
					method: ( request, reply ) => {
						const {
							postGuid
						} = request.params, {
							scope
						} = request.auth.credentials;
						const getOperation = Knex( 'posts' ).where( {
							guid: postGuid,
						} ).select( 'owner' ).then( ( [ result ] ) => {
							if ( !result ) {
								reply( {
									error: true,
									errMessage: `the post with id ${ postGuid } was not found`
								} ).takeover();
							}
							if ( result.owner !== scope ) {
								reply( {
									error: true,
									errMessage: `the post with id ${ postGuid } is not in the current scope`
								} ).takeover();
							}
							return reply.continue();
						} );
					}
    } ],
		},
		handler: ( request, reply ) => {
			const {
				postGuid
			} = request.params, {
				post
			} = request.payload;
			const insertOperation = Knex( 'posts' ).where( {
				guid: postGuid,
			} ).update( {
				name: post.name,
				picture_url: post.picture_url,
				isPublic: post.isPublic,
			} ).then( ( res ) => {
				reply( {
					message: 'successfully updated post'
				} );
			} ).catch( ( err ) => {
				reply( 'server-side error' );
			} );
		}
} ];
export default routes;
