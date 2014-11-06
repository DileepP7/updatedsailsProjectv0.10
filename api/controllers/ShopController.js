module.exports = {
	 
  //show all shops
  index: function(req,res,next){

  	//Get an array of all Products in the product collection
  	Shop.find(function foundShop(err,shop){
  		if(err) return(err);

  		//pass array to the view
  		res.view({
  			shop : shop
  		});
  	});
  },

  new: function(req,res){
    res.view();
  },

  /*show: function(req,res,next){
    Shop.findOne(req.param('shopId'), function foundShop(err,shop) {
      if(err) return next(err);

      if(!shop) return next();

      res.view({
        shop: shop
      });
    });
  },
*/

  create: function(req,res,next){
    //create shop with params sent from shop/new.ejs
    var myshop={
      shop_name:req.param('shop_name'),
      shop_desc:req.param('shop_desc'),
      shop_category:req.param('shop_category')
    };

    Shop.create(myshop, function shopCreated(err,shop){

      //if error
      if(err){
        console.log(err);
        req.session.flash = {
          err: err
        }

        //if error redirect to the add new shop page
        return res.redirect('/shop/new');
      }

      //If shop create sucessfully, redeirect to the show acion
      // res.json(shop); //show json 
       res.redirect('/shop');
      //res.redirect('/user/show/'+user.id);
      

    });
  },


  edit: function(req,res,next){

    //Find the product by id 
    Shop.findOne(req.param('id'),function foundShop(err,shop){
      if(err) return next(err);
      if(!shop) return next();

      res.view({
 
        shop: shop
      });
    });
  },


  latestShop: function(req,res,next){
    Shop.find().sort('createdAt DESC').exec(function(err, shop) {

    // Error handling
    if (err) {
      return console.log(err);

    // Found multiple users!
    } else {
      //send shop to homepage(static/index.ejs)
      //res.json(shop);
      console.log(shop.length);
      
      
      res.view('static/index',{shop:shop});
    }
  });
  },

  subscribe: function(req, res){
    
  }

  };

 


 
   /* destroy: function (req, res, next) {

                          var id = req.param('id');


                          if (!id) {
                              return res.badRequest('No id provided.');
                          }

                          Shop.findOne(id).exec(function(err, shop) {
                              if (err) return res.serverError(err);

                              if (!shop) return res.notFound();

                                  shop.destroy(id, function (err) {

                                      if (err){
                                       return next (err);
                                     } else {
                                         // res.send("Successfully Created!");
                                          res.redirect( '/Shop');
                                                                                    
                                           }
                                    //  return res.json(result);
                                  });

                          });
                      } */
