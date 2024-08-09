import db from "../models/index"
    

let getTopDoctorHome = (limitInput) =>{
    return new Promise(async(resolve, reject) => {
        try{
            let users = await db.User.findAll({
                limit: limitInput,
                where: {roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        }catch(e){
            reject(e)
        }
    })
}

let getAllDoctor = () =>{
    return new Promise(async(resolve, reject) => {
        try{
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        }catch(e){
            reject(e)               //if this gets rejected it's gonna run into the catch of the function that calls this function in doctorController
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor
}