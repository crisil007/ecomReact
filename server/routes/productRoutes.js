const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/fileUpload'); // Import updated multer config
const{set}=require('mongoose');
const accessControl=require('../utils/access-control').accessControl;
function setaccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}
// Route for adding a new product
router.post('/addProduct/:id',  productController.addProducts);

// Route for updating an existing product by ID
// router.post('/addProduct/:id', upload.array('images', 5), productController.updateProduct);

// Route for fetching products
router.get('/getProducts', productController.getProducts);
router.get('/getProducts/:sellerId', productController.getProductsBySeller);
router.get('/product/:id',productController.viewSingleProduct);
router.get('/getProducts/brands', productController.fetchBrands);

router.patch("/products/:id/status" , productController.blockproducts);
module.exports = router;
