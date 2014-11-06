module.exports = {

  schema : true,
  autoCreatedAt:false,
  autoUpdatedAt:false,
 // autoPK:false,
  attributes: {

 
   /*   shopId:{
      type:'integer',
      primaryKey:true,
     // autoIncrement:true
      },
      userId:{
        model:'user'
      }, */

   // id:{
    //  type:'integer',
    //  primaryKey:true,
     // autoIncrement:true
    //},
 
  	
  	shop_name: {
  		type: 'string',
  		required: true
  	},

  	shop_desc: {
  		type: 'string',
  		required: true
  	},

    shop_category:{
      type:'string',
      required:true
    },

    product: {
      collection: 'product',
      via: 'shop_id'
    },

    createdBy: {
      type: 'string',
      model:'user'
    },

    shopStatus:{
      type:'string'
    },

    fileupload:{
      type:'string'
    },

    subscribeBy: {
      type: 'string',
      collection: 'user'
    }

    
  }

};