/**
 * ShopSubscribeController
 *
 * @description :: Server-side logic for managing shopsubscribes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	// subscribe a shop -- this is bound to 'post /shop/:shopId/users'
	'subscribeShop': function(req, res, next) {
		// Get the ID of the shop to subscribe
		var shopId = req.param('shopId');
		// Subscribe the requesting socket to the "message" context, 
		// so it'll get notified whenever shop.message() is called
		// for this shop.
		Shop.subscribe(req, shopId, ['message']);
		// Continue processing the route, allowing the blueprint
		// to handle adding the user instance to the shop's `users`
		// collection.
		return next();
	},

	// unsubscribe a shop -- this is bound to 'delete /shop/:shopId/users'
	'unsubscribeShop': function(req, res, next) {
		// Get the ID of the shop to subscribe
		var shopId = req.param('shopId');
		// Unsubscribe the requesting socket from the "message" context
		Shop.unsubscribe(req, shopId, ['message']);
		// Continue processing the route, allowing the blueprint
		// to handle removing the user instance from the shop's 
		// `users` collection.
		return next();
	}

	
};

