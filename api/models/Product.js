/**
 * Product
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */


module.exports = {

  schema : true,
  autoCreatedAt:false,
  autoUpdatedAt:false,
  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/

  	prod_name: {
  		type: 'string',
  		//required: true
  	},

  	prod_desc: {
  		type: 'string',
  		//required: true
  	},

  	prod_base_price:{
  		type: 'integer',
  		//required: true
  	},

    fileupload: {
        type: 'string' 
    },
    prod_sample:{
      type:'string'
    },

    createdBy: {
      type: 'string'
    },
    
    shop_id: {
      type: 'integer',
      model: 'shop'
    },

    featured: {
      type: 'boolean',
      defaultsTo : false
    },

  	// feature:{
  	// 	 type: 'boolean',
   //    defaultsTo : false
  	// }

  	// beforeValidation: function(values,next){
   //  console.log(values);
   //  if(typeof values.feature !== 'undefined'){
   //    if(values.feature === 'unchecked'){
   //      values.feature = false;
   //    }else if(values.feature[1] === 'on'){
   //      values.feature = true;
   //    }
   //  }
   //  next();
  	// }

  beforeUpdate: function(values, cb) {
    // accessing the function defined above the module.exports
      console.log("Updating product Information");
      values.prod_name = 'Dileep';
      cb();
    
  }



    
  }

};
