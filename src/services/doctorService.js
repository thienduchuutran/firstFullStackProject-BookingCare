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

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async(resolve, reject)=>{
        try{
            if(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown){
                // console.log(inputData.id)
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Saved doctor info successfully!'
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try{
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param!!'
                })
            }else{
                let data = await db.User.findOne({
                    where: {id: inputId},
                    attributes: {
                        exclude: ['password', 'image']
                    },
                    include: [
                        {model: db.Markdown,                //this include here means find and get a user from User table in db, also get any data related to that user in Markdown table
                        attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']} //by doing this, we can also include any data from allcode table in the API for frontend
                    ],
                    raw: true,
                    nest: true
                },
            )
            resolve({
                errCode: 0,
                data: data
            })
            }
        }catch(e){
            reject(e)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById
}