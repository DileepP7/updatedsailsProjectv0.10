/**
* Contact.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  	schema: true,
	attributes: {

    // user to send the request
    from: {
      type: 'string',
      required: true
    },

    to: {
      type: 'string',
      required: true
    },

    // requested | accepted| ignored
    status: {
      type: 'string',
      defaultsTo: 'requested',
      'in': ['requested', 'accepted', 'ignored']
    }

  },

  beforeCreate: function(record, next) {
    // on create status will be requested
    record.status = 'requested';
    next();
  },

/**
*GET USER CONTACT RELATIONSHIP
*/
  getUsersRelationship: function getUsersRelationship(uid, contact_id, callback){
    Contact.findOne()
    .where({
      or: [{
        from: uid,
        to: contact_id
      },{
        from: contact_id,
        to: uid
      }]
    })
    .exec(function (err, contact) {
      if(err) return callback(err, null);
      // no relationship found
      if(!contact) return callback();
      // if request is to user uid
      if(contact.status === 'requested' && contact.to === uid){
        contact.status = 'Incoming Request';
      }
      callback(err, contact);
    });
  },

/**
*GET USER CONTACTS WITH USER-ID
*/
  getUserContacts: function getUserContacts(uid, callback){
    Contact.find()
    .where({
      or: [{
        from: uid,
      },{
        to: uid
      }]
    })
    .exec(function(err, contacts){
      callback(err,contacts);
    });
  }

};

