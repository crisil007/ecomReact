'use strict';

const category = require("../models/brand");

module.exports = {
  up: (models, mongoose) => {
    
      return models.brand.insertMany([
        {
          _id:"6767ba2d256c81e9528a2943",
          brand:"puma"
        },
        {
          _id:"6767ba44256c81e9528a2944" ,
          brand:"nike"
        }
        ,
        {
          _id:"6767ba53256c81e9528a2945",
          brand:"addidas"
        }
        ,{
          _id: "6767bab7256c81e9528a2946",
          brand:"redtape"
        },{
          _id: "6767bb13256c81e9528a2947",
          brand:"new balance"
        },
        {
          _id:"6767bbe6256c81e9528a2948",
          brand:"vans"
        },
       { _id:"6767bc90256c81e9528a2949",
        brand:"Skechers"}
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
    
    
      return models.brand.deleteMany({
        _id : {
          $in :[
           "6767ba2d256c81e9528a2943",
           "6767ba44256c81e9528a2944",
          "6767ba53256c81e9528a2945",
          "6767bab7256c81e9528a2946",
          "6767bb13256c81e9528a2947",
        "6767bbe6256c81e9528a2948",
        "6767bc90256c81e9528a2949"
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  
  }
};
