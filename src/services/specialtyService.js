const { reject } = require("lodash")
const db = require("../models")

let createSpecialty = (data) => {
    return new Promise(async(resolve, reject)=>{
        try{
            if( !data.imageBase64 
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

let getAllSpecialties = () => {
    return new Promise(async(resolve, reject)=>{
        try{
            let data = await db.Specialty.findAll()     //in reality we gotta limit to optimize the query and API
            
            //this is to convert (encode) image from blob to binary
            if(data && data.length > 0){
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')    //HTML can only understand string type aka base64, but db is saving as binary type so this step is to convert back to binary
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 0,
                data
            })
        }catch(e){
            reject(e)
        }

    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if( !inputId || !location)
            {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param'
                })
            }else{
                                                                              //with location = all, regardless of regions,  
                    let data = await db.Specialty.findOne({                        //this is looking for what specialty as well as getting descriptions of such specialty
                        where: {
                            id: inputId
                        },
                        attributes: ['descriptionHTML', 'descriptionMarkdown'],
                    })


                    if(data){
                        let doctorSpecialty = []
                        if(location === 'ALL'){
                            doctorSpecialty = await db.Doctor_Info.findAll({          //after getting data about such specialty, we go into Doctor_Info table
                                where: {                                            //to get all doctors that have specialtyId === input specialtyId we pass in
                                    specialtyId: inputId                            //at the same time also get doctorId and provinceId 
                                },
                                attributes: ['doctorId', 'provinceId'],
                            })
                        }else{
                            //find by location
                            doctorSpecialty = await db.Doctor_Info.findAll({          
                                where: {
                                    specialtyId: inputId,
                                    provinceId: location
                                },
                                attributes: ['doctorId', 'provinceId'],
                            })
                        }
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
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialties: getAllSpecialties,
    getDetailSpecialtyById: getDetailSpecialtyById
}