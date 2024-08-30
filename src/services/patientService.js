import { raw } from "body-parser";
import db from "../models/index"
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result

}

let postBookAppointment = (data) => {
    return new Promise (async(resolve, reject)=> {
        try{
            //Since we wanna get more of patient info (gender and adress) for doctors to see, we add selectedGender and address here
            if(!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender || !data.address
            ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'  

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                })
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {                                  //this default means if not found, then the code runs into defaults and does whatever in default
                      email: data.email,
                      roleId: 'R3',
                      address: data.address,
                      gender: data.selectedGender,                //this is where we actually save patients' gender and address to User table
                        firstName: data.fullName
                    },
                    raw: true
                  });
                
                    //findOrCreate returns an array with 2 element, first one is the object, second one is boolean indicating if a new object is created or already existed
                  //create a booking record
                  if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id            //this is to prevent spamming
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                  }

                  resolve({
                    errCode: 0,
                    errMessage: 'Succeeded'
                  })
            }

        }catch(e){
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data)=>{
    return new Promise(async(resolve, reject) => {
        try{
            if(!data.token || !data.doctorId
            ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'          //means only get the new ones
                    },
                    raw: false                  //sequelize object so that we can use save() function later
                })

                if(appointment){
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update appointment successfully!'
                    })
                }else{
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or not existed'
                    })  
                }
            }
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}