const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/error/app-error");
const {UserService}=require('../services')

function validateCreateUserRequest(req,res,next){

    if(!req.body.email){
        ErrorResponse.message="Something wrong while Creating User"
        ErrorResponse.error=new AppError(['email no is not in proper format'],StatusCodes.BAD_REQUEST);

    return res
              .status(StatusCodes.BAD_REQUEST)
              .json(ErrorResponse)

    }
    if(!req.body.password){
        ErrorResponse.message="Something wrong while Creating User"
        ErrorResponse.error=new AppError(['Password no is not in proper format'],StatusCodes.BAD_REQUEST);

    return res
              .status(StatusCodes.BAD_REQUEST)
              .json(ErrorResponse)

    }
    next();

}

async function checkAuthentication(req,res,next){
    try {
        const token=req.headers['x-access-token'];
        if(!token) throw new AppError('Please provide Access Token',StatusCodes.BAD_REQUEST);
        const response= await UserService.isAuthenticated(token);
        if(response){
            req.user=response;
            next();
        }
    } catch (error) {
        console.log(error);
        return res
        .status(error.statusCode)
        .json(error)
    }
}
module.exports={
    validateCreateUserRequest,
    checkAuthentication
}