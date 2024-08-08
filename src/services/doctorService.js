import db from "../models/index"
    

let getTopDoctorHome = (limitInput) =>{
    return new Promise(async(resolve, reject) => {
        try{
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password', 'image']
                },
                // raw: true
            })
            resolve({
                errCode: 0,
                data: users
            })
            console.log(users)
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome
}