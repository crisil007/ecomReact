'use strict';

const category = require("../models/category");

module.exports = {
  up: (models, mongoose) => {
    
      return models.category.insertMany([
        {
          _id:"673dac89b986cd1028d89334",
          category:"mens"
        },
        {
          _id: "673dad12b986cd1028d89335",
          category:"womens"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
    
    
      return models.category.deleteMany({
        _id : {
          $in :[
           "673dac89b986cd1028d89334",
            "673dad12b986cd1028d89335"
        
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  
  }
};
