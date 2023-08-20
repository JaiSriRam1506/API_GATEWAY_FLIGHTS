const { Logger } = require('../config')
const {UserService}=require('../services')

const {StatusCodes}=require('http-status-codes')

const {ErrorResponse,SuccessResponse}=require('../utils/common');

/**
 * POST:/signup
 * req-body{email:abc@gmail.com,password:1234}
 */

async function signUp(req,res){
    try {
        const user=await UserService.signUp({
            email:req.body.email,
            password:req.body.password
            });
            SuccessResponse.data=user;
            return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        Logger.error(error);
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function signIn(req,res){
    try {
        const user=await UserService.signIn({
            email:req.body.email,
            password:req.body.password
            });
            SuccessResponse.data=user;
            return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        Logger.error(error);
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function addRoleToUser(req,res){
    try {
        const response= await UserService.addRoleToUser({
            id:req.body.id,
            role:req.body.role
        });
        SuccessResponse.data=response;
        return res
                  .status(StatusCodes.OK)
                  .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error;
        return res
                  .status(error.statusCode)
                  .json(ErrorResponse)
    }
}

module.exports={
    signUp,
    signIn,
    addRoleToUser
}