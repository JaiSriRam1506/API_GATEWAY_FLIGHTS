const { Logger } = require('../config')
const {UserService}=require('../services')

const {StatusCodes}=require('http-status-codes')

const {ErrorResponse,SuccessResponse}=require('../utils/common')

/**
 * POST:/signup
 * req-body{email:abc@gmail.com,password:1234}
 */

async function signup(req,res){
    try {
        const user=await UserService.signup({
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

module.exports={
    signup
}