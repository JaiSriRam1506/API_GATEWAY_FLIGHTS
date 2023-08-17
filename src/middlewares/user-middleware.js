const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/error/app-error");

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

module.exports={
    validateCreateUserRequest
}