/**
 * ContactController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getAllAuthenticatedUserContacts: function(req, res, next) {
    if(!req.isAuthenticated()) return res.forbidden();

    var userId = req.user.id;

    Contact.find()
    .where({
      or: [
        {
          from: userId
        },
        {
          to: userId
        }
      ],
      status: 'accepted'
    })
    .exec(function(err, contacts){
      if (err) return next(err);
      return res.send({contact: contacts});
    });
  },

  findOneUserContact: function(req, res, next) {
    if(!req.isAuthenticated()) return res.forbidden();

    var uid = req.user.id;
    var contactId = req.param('contactId');

    Contact.getUsersRelationship(uid, contactId, function(err, contact){
      if (err) return next(err);

      if(!contact){
        return res.send();
      }

      return res.send({contact: contact});
    });
  },

  /**
   * REQUEST CONTACT RELATIONSHIP
   */
  requestContact: function requestContact (req, res) {
    if(!req.user.id) return res.forbiden();

    var uid = req.user.id;
    var contactId = req.param('contactId');

    Contact.create({
      from: uid,
      to: contactId
    })
    .exec(function(err, contact){
      if(err) return res.negotiate(err);
      res.send(201,{contact: contact});
    });
  },

/**
   * ACCEPT CONTACT RELATIONSHIP
   */
acceptContact: function acceptContact (req, res) {
    if(!req.user.id) return res.forbiden();

    var uid = req.user.id;
    var contactId = req.param('contactId');

    // first get and check if has one relationship
    Contact.getUsersRelationship(uid, contactId, function(err, contact){
      if (err) return res.negotiate(err);

      if(!contact) return res.notFound();
      // only logged in user can accept one contact
      if(contact.to != uid ) return res.forbiden();

      // set new status
      contact.status = 'accepted';
      contact.save(function(err){
        if (err) return res.negotiate(err);
        // send the response
        return res.send({contact: contact});
      });
    });
  },

  ignoreContact: function ignoreContact (req, res) {
    if(!req.user.id) return res.forbiden();

    var uid = req.user.id;
    var contactId = req.param('contactId');

    // first get and check if has one relationship
    Contact.getUsersRelationship(uid, contactId, function(err, contact){
      if (err) return res.negotiate(err);

      if(!contact) return res.notFound();
      // only logged in user can accept one contact
      if(contact.to != uid ) return res.forbiden();
      // set new status
      contact.status = 'ignored';
      contact.save(function(err){
        if (err) return res.negotiate(err);

        // send the response
        return res.send({contact: contact});
      });
    });
  },


	
};

