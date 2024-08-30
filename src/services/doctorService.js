import { raw } from "body-parser"
import db from "../models/index"
require('dotenv').config()
import _, { attempt, includes } from 'lodash'

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

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic',
        'note', 'specialtyId']

        let isValid = true
        let element = ''
        for(let i = 0 ; i<arrFields.length; i++){
            if(!inputData[arrFields[i]]){
                 isValid = false
                 element = arrFields[i]
                 break
            }
        }
        return{
            isValid: isValid,
            element: element
        }
}

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async(resolve, reject)=>{
        try{ 
            let checkObj = checkRequiredFields(inputData)
            if(checkObj.isValid === false)       //validating
                {
                // console.log(inputData.id)
                resolve({
                    errCode: 1,
                    errMessage: `Missing param: ${checkObj.element}`
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
                        doctorMarkdown.updatedAt = new Date()                    
                        await doctorMarkdown.save();
                    }
                    // Now the name was updated to "Ada" in the database!                    
                }

                //upsert to Doctor_info table
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId,           //using id to find an object of a doctor in Doctor_Info table
                    },
                    raw: false                                  //raw = false so that it returns a sequelize instance, not an object
                })

                if(doctorInfo){
                    //update
                    doctorInfo.doctorId = inputData.doctorId
                    doctorInfo.priceId = inputData.selectedPrice                  //priceId in db is associated with selectedPrice 
                    doctorInfo.provinceId = inputData.selectedProvince
                    doctorInfo.paymentId = inputData.selectedPayment 
                    doctorInfo.nameClinic = inputData.nameClinic
                    doctorInfo.addressClinic = inputData.addressClinic
                    doctorInfo.note = inputData.note
                    doctorInfo.specialtyId = inputData.specialtyId                  
                    doctorInfo.clinicId = inputData.clinicId                   
                    await doctorInfo.save();
                }else{
                    //create
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId : inputData.selectedPrice,             
                        provinceId : inputData.selectedProvince,
                        paymentId : inputData.selectedPayment, 
                        nameClinic : inputData.nameClinic,
                        addressClinic : inputData.addressClinic,
                        note : inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId             
                    })
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

                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']}, //by doing this, we can also include any data from allcode table in the API for frontend
                        
                        {model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            //this is an example of eager loading
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},        //this is to get the value (eng and viet) to show on UI
                                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']}
                            ]               
                        },
                    
                    ],
                    raw: false, //raw = true means sequelize object
                    nest: true
                },
            )
            if(data && data.image){
                data.image = Buffer.from(data.image, 'base64').toString('binary')    //converting image to base64 from backend side  
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
            if(!data.arrSchedule || !data.doctorId || !data.formattedDate){
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

                //get all existing data
                let existing = await db.Schedule.findAll({
                    where: {doctorId: data.doctorId, date: data.formattedDate},
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                //convert date
                // if(existing && existing.length > 0){
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime()
                //         return item
                //     })
                // }

                //compare the ones in db and the new ones that are just passed from UI
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    // // console.log('check a: ', a)
                    // console.log('check b: ', b)
                    return a.timeType === b.timeType && +a.date === +b.date
                })

                //if there is a difference between the new data and the existing data in db, we save the difference only
                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate( toCreate )
                }else{
                    resolve({
                        errCode: 0,
                        errMessage: 'already saved!'
                    })
                }
                console.log('check difference ================', toCreate)
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

let getScheduleByDate = (doctorId, date)=>{             //this API is to get the available times of the selected doctor on the selected day
    return new Promise(async(resolve, reject)=>{
        try{
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param'
                })
            }else{
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date                      //we passing timestamp as unix (a string of numbers) so we can easily change format later (using moment library)
                    },
                    include: [
                        {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']}, //by doing this, we can also include any data from allcode table in the API for frontend
                        {model: db.User , as: 'doctorData', attributes: ['firstName', 'lastName']}
                        
                    ],
                    raw: false, //raw = true means sequelize object
                    nest: true
                })
                if(!dataSchedule) dataSchedule = []

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

let getExtraInfoDoctorById = (idInput) => {
    return new Promise (async(resolve, reject)=> {
        try{
            if(!idInput){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param'                    
                })
            }else{
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    //this is an example of eager loading
                    include: [
                        {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},        //this is to get the value (eng and viet) to show on UI
                        {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']}
                    ],
                    raw: false,
                    nest: true
                })
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

let getProfileDoctorById = (inputId) => {
    return new Promise(async(resolve, reject)=>{
        try{
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param'
                })
            }else{
                let data = await db.User.findOne({
                    where: {id: inputId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']}, //In User table, we already have positionId, so we gotta join positionData to get the actual name of the position
                        
                        {model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            //this is an example of eager loading
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},        //this is to get the value (eng and viet) to show on UI
                                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']}
                            ]               
                        },
                    
                    ],
                    raw: false, //raw = true means sequelize object
                    nest: true
                },
            )
            if(data && data.image){
                data.image = Buffer.from(data.image, 'base64').toString('binary')    //converting image to base64 from backend side  
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

//we targeting Bookings table, getting patient info from Bookings
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async(resolve, reject)=> {
        try{
            if(!doctorId || !date){
                resolve({
                    errCode: 1, 
                    errMessage: "Missing param"
                })
            }else{  
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',          //since S2 means the booking status is confirmed but not completed yet
                        doctorId: doctorId,
                        date: date
                    },
                    include: [              //this is where we also get patient info from User table right after getting basic patient info in Bookings table
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},  //this will give us the whole full name of a gender in eng and viet
                            ]
                        },
                    ],
                    raw: false, //returning sequelize object
                    nest: true
                })
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
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById, 
    getListPatientForDoctor: getListPatientForDoctor
}