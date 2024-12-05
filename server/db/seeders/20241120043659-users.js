



'use strict';

const user_type = require("../models/user_type");
module.exports = {
  up: (models, mongoose) => {
  
      return models.user_type.insertMany([
        {
          _id:"673d6d56751d8f9abf59f6fc",
          user_type:"admin"
        },
        {
          _id:"673d6d9a751d8f9abf59f6fd",
          user_type:"buyer"
        },
        {
          _id:"673d6e73751d8f9abf59f6ff",
          user_type:"seller"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  
  },

  down: (models, mongoose) => {
    
      return models.user_type.deleteMany({
        _id : {
          $in :[
           "673d6d56751d8f9abf59f6fc" ,
           "673d6d9a751d8f9abf59f6fd" ,
           "673d6e73751d8f9abf59f6ff",
        
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    
  }
};
