import db from "../models/index"
require('dotenv').config()

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
    

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
            if(!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown
                || !inputData.action
            ){
                // console.log(inputData.id)
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{
                if(inputData.action === 'CREATE'){
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
    
                    })
                }else if(inputData.action === 'EDIT'){
                    let doctorMarkdown  = await db.Markdown.findOne({
                        where: {doctorId: inputData.doctorId},
                        raw: false               //so that it becomes a sequelize object
                    })
                    if(doctorMarkdown){
                        doctorMarkdown.contentHTML = inputData.contentHTML
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown
                        doctorMarkdown.description = inputData.description   
                        // doctorMarkdown.updatedAt = new Date()                    
                        await doctorMarkdown.save();
                    }
                    // Now the name was updated to "Ada" in the database!                    
                }


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
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Markdown,                //this include here means find and get a user from User table in db, also get any data related to that user in Markdown table
                        attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']} //by doing this, we can also include any data from allcode table in the API for frontend
                    ],
                    raw: false, //raw = true means sequelize object
                    nest: true
                },
            )
            if(data && data.image){
                data.image = new Buffer(data.image, 'base64').toString('binary')    //converting image to base64 from backend side  
            }

            if(!data) data = {}

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

let bulkCreateSchedule = (data) => {
    return new Promise(async(resolve, reject)=>{
        try{
            if(!data){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param'
                })
            }else{
                let schedule = data.arrSchedule
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE        //added this attribute so it aligns with what was designed in db
                        return item
                    })
                }
                console.log('data sent: ', schedule)
                await db.Schedule.bulkCreate( schedule )
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
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
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule
}