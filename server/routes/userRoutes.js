const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController')

router.post('/users',userController.createuser),
router.get('/getusers',userController.getAllUsers)
router.get('/getuser/:id',userController.getUserById)
router.put('/updateuser/:id',userController.updateUser)
router.get('/dashboard-stats',userController.getDashboardStats);


router.patch('/users/:id/block', userController.blockUser);




router.post('/requestUpgrade',userController.requestUpgrade);
router.put('/approveUpgrade/:userId', userController.approveupgrade);
router.get('/upgradeRequests',  userController.getAllUpgradeRequests)


module.exports=router