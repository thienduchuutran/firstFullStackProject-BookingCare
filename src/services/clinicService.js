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

let getDetailClinicById = () => {
    return new Promise(async(resolve, reject) => {
        try{
            if( !inputId)
                {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing param'
                    })
                }else{
                                                                                  //with location = all, regardless of regions,  
                        let data = await db.Clinic.findOne({                        //this is looking for what specialty as well as getting descriptions of such specialty
                            where: {
                                id: inputId
                            },
                            attributes: ['descriptionHTML', 'descriptionMarkdown'],
                        })
    
    
                        if(data){
                            let doctorClinic = []
                            doctorClinic = await db.Doctor_Info.findAll({          //after getting data about such specialty, we go into Doctor_Info table
                                    where: {                                            //to get all doctors that have specialtyId === input specialtyId we pass in
                                        clinicId: inputId                            //at the same time also get doctorId and provinceId 
                                    },
                                    attributes: ['doctorId', 'provinceId'],
                                })
                            
                            data.doctorSpecialty = doctorSpecialty                  //finally append all data into data, so our data now has 3 attributes:
                        }else{                                                      //descriptionHTML, descriptionMarkdown, and doctorSpecialty
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