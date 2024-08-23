import db from "../models/index"
require('dotenv').config()

let postBookAppointment = (data) => {
    return new Promise (async(resolve, reject)=> {
        try{
            if(!data.email || !data.doctorId || !data.timeType || !data.date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {                                  //this default means if not found, then the code runs into defaults and does whatever in default
                      email: data.email,
                      roleId: 'R3'
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
                            timeType: data.timeType
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

module.exports = {
    postBookAppointment: postBookAppointment
}