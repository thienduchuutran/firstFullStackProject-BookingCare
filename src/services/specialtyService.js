const db = require("../models")

let createSpecialty = (data) => {
    return new Promise(async(resolve, reject)=>{
        try{
            if(!data.email 
                || !data.imageBase64 
                || !data.descriptionHTML 
                || !data.descriptionMarkdown
            ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{

                await db.Specialty.create({
                    image: data.imageBase64,
                    name: data.name,
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

module.exports = {
    createSpecialty: createSpecialty
}