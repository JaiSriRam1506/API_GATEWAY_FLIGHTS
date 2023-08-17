const express=require('express');

const {UserController}=require('../../controllers');
const {UserMiddleware} = require('../../middlewares');

const router=express.Router();

/*  /api/v1/signup POST */
router.post('/',UserMiddleware.validateCreateUserRequest,
                UserController.signup);

module.exports=router;