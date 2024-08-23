import db from "../models/index"
require('dotenv').config()

let postBookAppointment = (data) => {
    return new Promise (async(resolve, reject)=> {
        try{
            if(!data.email){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{
                //upsert patient
                await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {                                  //this default means if not found, then the code runs into defaults and does whatever in default
                      email: data.email,
                      roleId: 'R3'
                    },
                  });

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