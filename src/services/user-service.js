const {UserRepository}=require('../repositories')
const AppError=require('../utils/error/app-error')
const {StatusCodes}=require('http-status-codes');

const {Auth}=require('../utils/common')

const userRepository = new UserRepository();

async function signUp(data){
    try {
        const user=await userRepository.create(data);
        return user;
    } catch (error) {
        if(error.name == 'SequelizeValidationError' || error.name =='SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }  
}

async function signIn(data){
    try {
        const user= await userRepository.getUserEmail(data.email);

        if(!user){
            throw new AppError('Cannot find User in the DataBase',StatusCodes.NOT_FOUND);
        }
        const passwordMatch= Auth.checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('Password don\'t match ',StatusCodes.NOT_FOUND);
        }

        if(user.email!=data.email){
            throw new AppError('Invalid User',StatusCodes.NOT_FOUND)
        }

        const jwtToken=Auth.createToken({id:user.id,email:user.email});
        return jwtToken;
        
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Couldn\'t able to login',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAuthenticated(token){
    try {
        const response=Auth.verifyToken(token);

        const user= await userRepository.get(response.id);
        if(!user){
            throw new AppError('User not found',StatusCodes.NOT_FOUND);
        }

        return user;
    } catch (error) {
        console.log(error);
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name=='TokenExpiredError'){
            throw new AppError('JWT Token has been expired',StatusCodes.BAD_REQUEST)
        }
        throw new AppError("Unable to authenticate to the Server",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports={
    signUp,
    signIn,
    isAuthenticated
}