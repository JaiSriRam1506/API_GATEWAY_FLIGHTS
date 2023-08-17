const CrudRepository=require('./crud-repository')

const {User}=require('../models')

class UserRepository extends CrudRepository{
    constructor(){
        super(User);
    }
    async getUserEmail(email) {
        const response = await User.findOne({
            where:{
                email:email
            }
        });
            if(!response){
                throw new AppError("",StatusCodes.NOT_FOUND)
            }
            return response;
    }
}

module.exports=UserRepository;