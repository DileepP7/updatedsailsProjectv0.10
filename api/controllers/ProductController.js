/**
 * ProductController
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

 var fs = require('fs');
 var path = require('path');
 var mkdirp = require('mkdirp');
 var im = require('imagemagick');
 var UPLOAD_PATH = 'assets/uploads/';
 //var UPLOAD_PATH = 'mongodb://localhost:27017/mydb.files'
 var skipper = 'skipper-gridfs';
// var UPLOAD_PATH1= '/assets/images/testFolder';

module.exports = {
    
  'new' : function (req,res){
    
    var id = req.session.User.id;

    Shop.find({createdBy:id}).exec(function(err, shop) {
    // Error handling
    if (err) {
      return console.log(err);

    // Found multiple users!
    } else {
      //send shop to product create page(product/new.ejs)
      //res.json(shop);
      console.log(shop.length);
      res.view({shop:shop});
    }
    
    });
  },


   // if(req.files.prod_image.name!=''){
      create: function (req,res,next) {

   // console.log("File Details : "+ req.file(prod_image));
    //create product with params 
   // var extName = path.extname(req.file.uploadFile);
   // var fileName = req.param('id')+extName;
   // var newPath = UPLOAD_PATH +fileName;
   // var thumbPath = UPLOAD_PATH+"thumbs/"+fileName;
     // upload: function(req,res, next){
      var uploadFileDestination;
      var filesProp = null;
    
      var uploadFile = req.file('uploadFile');
     // console.log(uploadFile);
      uploadFile.upload({
            adapter: require('skipper-gridfs'),
            uri: 'mongodb://localhost:27017/mydb.product',
            //rname: './assets/uploads',
           // uploadedBy: req.user.id
       }, function onUploadComplete (err, files) {
                 // Files will be uploaded to .tmp/uploads
                                                                                        
          if (err) return res.serverError(err);   
        //  filesProp = files;
          uploadFileDestination = files[0].filename;

          
         // console.log('', files);
          //res.json({status:200,file:files.fd});
          //turn res.json({
        //        message: seeba+ ' file(s) uploaded successfully!',
       //essage:files
              
          //});
           

                                         // IF ERROR Return and send 500 error with error
     // res.redirect('/product/');
      
 // },

  
    var productObj = {
        prod_name: req.param('prod_name'),
        prod_desc: req.param('prod_desc'),
        prod_base_price: req.param('prod_base_price'),
        prod_sample: "dileep",
        fileupload: uploadFileDestination ,
        createdBy: req.param('createdBy')
    };

   /*  return res.json({
                 product:productObj
                 });
   },
*/
  
    Product.create(productObj, function productCreated(err,product){

      //if error
      if(err){
        console.log(err);
        req.session.flash = {
          err: err

        }

        //if error redirect to the product create page
        return res.redirect('/product/new');
      }
      //move file to UPLOAD_PATH
     // return res.json({
     //             product:productObj
     //             });
      res.redirect('/product/');
      
      
       });  
       }); 

      },
  		























  //	});


 //},


 //  Product.create(productObj, function productCreated(err,product){
  

   // if(req.files.prod_image.name!=''){
    //  create: function (req,res,next) {
   // console.log("File Details : "+ req.file(prod_image));
    //create product with params 
   // var extName = path.extname(req.files.prod_image.name);
   // var fileName = req.param('id')+extName;
   // var newPath = UPLOAD_PATH +fileName;
   // var thumbPath = UPLOAD_PATH+"thumbs/"+fileName;

   /* var productObj = {
        prod_name: req.param('prod_name'),
        prod_desc: req.param('prod_desc'),
        prod_base_price: req.param('prod_base_price'),
      //  prod_image: fileName,
        createdBy: req.param('createdBy')
    } */

     //            });
     //            });

  //show product details
  show: function(req,res,next){
  	Product.findOne(req.param('id'), function foundProduct(err,product) {
  		if(err) return next(err);

  		if(!product) return next();

  		res.view({
  			product: product
  		});
  	});
  },



  //show all products
  index: function(req,res,next){

  	//Get an array of all Products in the product collection
  	Product.find(function foundProduct(err,product){
  		if(err) return(err);

  		//pass array to the view
  		res.view({
  			product : product
  		});
  	});
  },

  //edit action 
/*  edit: function(req,res,next){

  	//Find the product by id 
  	Product.findOne(req.param('id'),function foundProduct(err,product){
  		if(err) return next(err);
  		if(!product) return next();

  		res.view({
  			product: product
  		});
  	});
  }, */
 
  edit: function(req,res,next){

    //Find the product by id 
    Product.findOne(req.param('id'),function foundProduct(err,product){
      if(err) return next(err);
      if(!product) return next();

       Shop.find({createdBy:req.session.User.id}).exec(function(err, shop) {
          if(err) return(err);

          res.view({
        product: product,
        shop: shop
      });

       });

      
    });
  },


  update: function(req, res, next) {
    var prodObj = {
      prod_name: req.param('prod_name'),
      prod_desc: req.param('prod_desc'),
      prod_base_price: req.param('prod_base_price'),
    //  fileupload: uploadFileDestination
    };

    if (req.session.User.admin) {
    
      var featured = false;
      var featuredParam = req.param('featured');

      if (typeof featuredParam !== 'undefined') {
        if (featuredParam === 'unchecked') {
          featured = false;
        } else  if (featuredParam[1] === 'on') {
          featured = true;
        }
      }
      prodObj.featured = featured;
    }

    Product.update(req.param('id'), prodObj, function productUpdated (err) {
      if (err) {
        return res.redirect('/product/edit/' + req.param('id'));
      }

      res.redirect('/product/show/' + req.param('id'));
    });
  }, 

/*  show: function(req,res,next){
    Product.findOne(req.param('id'), function foundProduct(err,product) {
      if(err) return next(err);

      if(!product) return next();

      res.view({
        product: product
      });
    });
  }, */

  //update the value from edit form
 /* update: function(req,res,next){


   /* var fs = require('fs');
    var extName = path.extname(req.files.prod_image.name);
    var fileName = req.param('id')+extName;
    var newPath = UPLOAD_PATH +fileName;
    var thumbPath = UPLOAD_PATH+"thumbs/"+fileName; 

    var productObj = {
        prod_name: req.param('prod_name'),
        prod_desc: req.param('prod_desc'),
        prod_base_price: req.param('prod_base_price'),

        uploadFile: fileName,
        createdBy: req.param('createdBy')

       // prod_image: fileName,
       // createdBy: req.param('createdBy')

    } 
     
  	Product.update(req.param('id'),productObj, function productUpdated(err){
  		if(err) {
  			//console.log(err);
  			req.session.flash = {
  				err: err
  			}

  		 	return res.redirect('/product/edit/'+req.param('id'));
  		}

      //console.log(req.files);

      console.log("File Name :"+req.files.uploadFile['name']);
    //  console.log("File Name :"+req.files.prod_image['name']);


      prod_image = req.files.prod_image['name'];




     if(req.files.uploadFile.name!=''){
     if(req.files.prod_image.name!=''){
      //move file to UPLOAD_PATH
      fs.readFile(req.files.uploadFile.path, function (err, data) {
          
          //req.param('prod_image') = newPath; 
          fs.exists(newPath, function(exists) { 
            // if (exists) { 
            //   console.log('File already exists');
      

            //   res.redirect('/product/edit/'+req.param('id'));

            // } else{

                console.log('Uploading image started....');

                /// write file to uploads/thumbs folder
                im.resize({
                  srcPath: newPath,
                  dstPath: thumbPath,
                  //width:   200,
                  height:  200
                  }, function(err, stdout, stderr){
                    if (err) {
                        throw err;
                      }
                      console.log('resized image to fit within 200x200px');
                  });

                fs.writeFile(newPath, data, function (err) {
                if (err) 
                console.log(err);
                res.redirect('/product/show/'+req.param('id'));
                 });

            //} 

            // end of file upload

          });

      
     //  }); 

    //  }

      //Product.create({createdbBy: 'admin'});
      // Product.update({prod_name: 'Water Bottle', prod_desc: 'Hot and cold Water', prod_base_price:33131, createdBy: 'admin', prod_image: 'abc.jpg'}).done(function(error, product) {
      //           if (error) {
      //               res.send(error);
      //           } else {
      //               console.log('Added Succesfully');
      //           }
      //         });

       //check if the directory exists
          // fs.exists(UPLOAD_PATH1, function(exists) {
          // if (!exists) {
          //     mkdirp('/assets/images/testFolder', function (err) {
          //     if (err) console.error(err)
          //     else console.log('Folder Created')
          //     });
          // }
          // });  
      //console.log(req.params.all());
  		
  //	});
  }, */

  //delete action
  destroy: function(req,res,next){

  	Product.findOne(req.param('id'), function foundProduct(err,product){

  		if(err) return next(err);

  		if(!product) return next('Product doesn\'t exists.');

  		Product.destroy(req.param('id'), function productDestroyed(err){
  			if(err) return next(err);
  		});

  		res.redirect('/product');

  	});
  },

  //search product according to their login
  myProduct: function(req,res,next){
    //console.log(req.session.User);

    Product.find({ createdBy: req.session.User.id}).exec(function(err, product) {
      if(err) {
        console.log("Cound not find products");
        console.log(err);
      } 

      if(!product) return next('Product doesn\'t exists.');

      //pass array to the view
      res.view({
        product : product
      });

    });

  },

  //Get the latest 10 products

  latestProduct: function(req,res,next){

    Product.find().paginate({page:1, limit:3}).sort('createdAt DESC').exec(function(err, product) {

    // Error handling
    if (err) {
      return console.log(err);

    // Found multiple users!
    } else {
      //send product to homepage(static/index.ejs)
      res.view({
        product : product
      });
    }
  });
},

addToCart: function(req,res,next){
    Product.find(req.param('id')).done(function(err,product){
      if(err)
        console.log(err);

      req.session.cart = req.param('id'); 
      console.log("Add to cart : "+req.session.cart);
      res.redirect('/product/latestProduct');
    });
  }
  
};
