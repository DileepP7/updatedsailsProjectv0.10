/**
 * Room
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  // Subscribers only get to hear about update and destroy events,
  // and about users subscribing or unsubscribing the shop.
  // This lets us keep our count of users in the shop accurate, without
  // sending message for a shop to anyone but people who actually
  // want to get them.  To get messages for a shop, you subscribe
  // to the 'message' context explicitly.
  autosubscribe: ['destroy', 'update', 'add:users', 'remove:users'],
  attributes: {

		name: 'string',
		users: {
			collection: 'user',
			//via: 'shops'
		}
    
  },


	
  afterPublishRemove: function(id, alias, idRemoved, req) {

  	// Get the shop and all its users
  	Room.findOne(id).populate('users').exec(function(err, shop) {
  		// If this was the last user, close the shop.  
  		if (shop.users.length === 0) {
  			shop.destroy(function(err) {
          // Alert all sockets subscribed to the shop that it's been destroyed.
  				Shop.publishDestroy(shop.id);
  			});
  		}
  	});

  }

};
