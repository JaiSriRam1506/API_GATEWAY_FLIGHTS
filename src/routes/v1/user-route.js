const express=require('express');

const {UserController}=require('../../controllers');
const {UserMiddleware} = require('../../middlewares');

const router=express.Router();

/*  /api/v1/user/signup POST */
router.post('/signup',UserMiddleware.validateCreateUserRequest,
                UserController.signUp);

/*  /api/v1/user/signin POST */
router.post('/signin',UserMiddleware.validateCreateUserRequest,
                UserController.signIn);
const middleware=[UserMiddleware.checkAuthentication,UserMiddleware.isAdmin]
//router.post('/role',UserController.addRoleToUser);
router.post('/role',middleware,UserController.addRoleToUser);

module.exports=router;