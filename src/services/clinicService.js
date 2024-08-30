const db = require("../models")


let createClinic = (data) => {
    return new Promise(async(resolve, reject)=>{
        try{
            if( !data.name || !data.address || !data.imageBase64 
                || !data.descriptionHTML 
                || !data.descriptionMarkdown
            ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{

                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async(resolve, reject) => {
        try{
            let data = await db.Clinic.findAll()    //in reality we gotta limit to optimize the query and API
            
            if(data && data.length > 0){
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')    //HTML can only understand string type aka base64, but db is saving as binary type so this step is to convert back to binary
                    return item
                })
            }

            resolve({
                errMessage: 'ok',
                errCode: 0,
                data
            })
        }catch(e){
            reject(e)
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try{
            if( !inputId)
                {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing param'
                    })
                }else{
                                                             
                        let data = await db.Clinic.findOne({                     
                            where: {
                                id: inputId
                            },
                            attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],          //these are the fields given out in network tab on front end
                        })
    
    
                        if(data){
                            let doctorClinic = []
                            doctorClinic = await db.Doctor_Info.findAll({          
                                    where: {                                           
                                        clinicId: inputId                           
                                    },
                                    attributes: ['doctorId', 'provinceId'],
                                })
                            
                            data.doctorClinic = doctorClinic        //this is so that we can receive any info in doctorClinic later in network tab on UI     
                        }else{                                                     
                            data = []
                        }
                        resolve({
                            errMessage: 'ok',
                            errCode: 0,
                            data
                        })
                } 
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById
}