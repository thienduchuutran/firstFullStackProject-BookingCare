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
            let data = await db.Clinic.findAll()     //in reality we gotta limit to optimize the query and API
            
            //this is to convert (encode) image from blob to binary
            if(data && data.length > 0){
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')    //HTML can only understand string type aka base64, but db is saving as binary type so this step is to convert back to binary
                    return item
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

let getDetailClinicById = () => {
    return new Promise(async(resolve, reject) => {
        try{

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