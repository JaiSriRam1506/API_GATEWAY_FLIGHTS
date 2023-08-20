const CrudRepository=require('./crud-repository')

const {Role}=require('../models')

class RoleRepository extends CrudRepository{
    constructor(){
        super(Role);
    }
    async getRoleByName(name) {
        const response = await Role.findOne({
            where:{
                name:name
            }
        });
            if(!response){
                throw new AppError("",StatusCodes.NOT_FOUND)
            }
            return response;
    }
}

module.exports=RoleRepository;