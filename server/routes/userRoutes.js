const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController')

router.post('/users',userController.createuser),
router.get('/getusers',userController.getAllUsers)
router.get('/getuser/:id',userController.getUserById)
router.put('/updateuser/:id',userController.updateUser)
router.get('/dashboard-stats',userController.getDashboardStats);


router.patch('/users/:id/block', userController.blockUser);
router.post('/request-seller/:id',userController.requestToBecomeSeller)
router.post('/approve-rquest',userController.approveSellerRequest)


module.exports=router