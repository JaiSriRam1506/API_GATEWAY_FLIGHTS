const {UserRepository,RoleRepository}=require('../repositories')
const AppError=require('../utils/error/app-error')
const {StatusCodes}=require('http-status-codes');

const {ENUMS}=require('../utils/common')

const {Auth}=require('../utils/common')

const userRepository = new UserRepository();
const roleRepo=new RoleRepository();

async function signUp(data){
    try {
        const user = await userRepository.create(data);
        const role = await roleRepo.getRoleByName(ENUMS.USER_ROLES_ENUMS.CUSTOMER);
        console.log(role);
        user.addRole(role);
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

        return user.id;
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

async function addRoleToUser(data){
    try {
        const user=await userRepository.get(data.id);
        if(!user){
            throw new AppError('User not found',StatusCodes.NOT_FOUND);
        }
        const role= await roleRepo.getRoleByName(data.role);
        if(!role){
            throw new AppError('Role not found',StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError)throw error;
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id){
    try {
        const user=await userRepository.get(id);
        if(!user){
            throw new AppError('No User Found',StatusCodes.NOT_FOUND);
        }
        const role=await roleRepo.getRoleByName(ENUMS.USER_ROLES_ENUMS.ADMIN);
        if(!role){
            throw new AppError('No such Roles found in the database',StatusCodes.NOT_FOUND);
        }
        return user.hasRole(role);
    } catch (error) {
        if(error instanceof AppError)throw error;
        throw new AppError('Something went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports={
    signUp,
    signIn,
    isAuthenticated,
    addRoleToUser,
    isAdmin
}