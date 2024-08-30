import clinicService from '../services/clinicService'

let createClinic = async(req, res) => {
    try{
        let info = await clinicService.createClinic(req.body)   //we are just sending all info to server, thats why req.body not req.query
        return res.status(200).json(                                                            
            info
        )
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })  
    }
}

let getAllClinic = async (req, res) => {
    try{
        let info = await clinicService.getAllClinic()
        return res.status(200).json(                                                            
            info
        )
        console.log('check info: ', info)
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })  
    }
}

let getDetailClinicById = async (req, res) => {
    try{
        let info = await clinicService.getDetailClinicById(req.query.id)   //we are just sending all info to server, thats why req.body not req.query
        return res.status(200).json(                                                            
            info
        )
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })  
    }    
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById
}