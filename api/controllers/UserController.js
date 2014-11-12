/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
/**
 * UserController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');

module.exports = {
    

  'new' : function (req,res){
    res.view();
    
  },

  create: function(req, res, next) {
    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    };

    User.create(userObj, function userCreated(err, user) {
      if (err) {
        req.session.flash = {
          err: err
        };

        return res.redirect('/user/new');
      }

      req.session.authenticated = true;
      req.session.User = user;


      if(req.session.User){
        user.online = true;
      }else{
      user.online = false;
    }
      user.save(function(err, user) {
        if (err) return next(err);

        user.action = " signed-up and logged-in.";

        User.publishCreate(user);

        res.redirect('/user/show/'+user.id);
      });
    });
  },

  //show user details
  show: function(req,res,next){
    User.findOne(req.param('id'), function foundUser(err,user) {
      if(err) return next(err);

      if(!user) return next();

      res.view({
        user: user
      });
    });
  },

  //show all users
  index: function(req,res,next){

    // console.log(new Date());
    // console.log(req.session.authenticated);

    //Get an array of all users in the user collection
    User.find(function foundUser(err,user){
      if(err) return(err);

      //pass array to the view
      res.view({
        user : user
      });
    });
  },

  //edit action 
  edit: function(req,res,next){

    //Find the user by id 
    User.findOne(req.param('id')).exec(function(err,user){
      if(err) return next(err);
      if(!user) return next();

      res.view({
        user:user
      });
    });
  },

  //update the value from edit form
  update: function(req, res, next) {
    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email')
    };

    if (req.session.User.admin) {
      // Changed this logic to here. I prefer to send clean stuff to models
      var admin = false;
      var adminParam = req.param('admin');

      if (typeof adminParam !== 'undefined') {
        if (adminParam === 'unchecked') {
          admin = false;
        } else  if (adminParam[1] === 'on') {
          admin = true;
        }
      }
      userObj.admin = admin;
    }

    User.update(req.param('id'), userObj, function userUpdated (err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  }, 
 

  //delete action
  destroy: function(req,res,next){

    User.findOne(req.param('id'), function foundUser(err,user){

      if(err) return next(err);

      if(!user) return next('User doesn\'t exists.');

      User.destroy(req.param('id'), function userDestroyed(err){
        if(err) return next(err);
      });

      res.redirect('/user');

    });
  },

  //Facebook Login 

  'login': function (req, res) {    
    res.view();
  },

  'dashboard': function (req, res) {
    res.view();
  },

  logout: function (req, res){
    req.session.User = null;
    console.log("You have logged out");
    req.session.flash = 'You have logged out';
    res.redirect('/user/login');
  },

  addShop: function(req,res){
    console.log("Adding Shop");
  },

 /* 'facebook/callback': function (req, res, next) {
     passport.authenticate('facebook',
        function (req, res) {
            res.redirect('/user/dashboard');
        })(req, res, next);
  }, */

  findUserShopById: function(req, res, next){
    var id = req.param('id');
    
    if(!id) return res.notFound();

    if(id){
      User.find(id).populate('shops')
        .exec(function(err, result){
          if(err) return res.serverError();
          if(!result) return res.notFound();

          res.json({
            result: result
          });
        });
      }
    }

};







