import specialtyService from '../services/specialtyService'

let createSpecialty = async(req, res) => {
    try{
        let info = await specialtyService.createSpecialty(req.body)   //we are just sending all info to server, thats why req.body not req.query
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

let getAllSpecialties = async(req, res) => {
    try{
        let info = await specialtyService.getAllSpecialties()   //we are just sending all info to server, thats why req.body not req.query
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

let getDetailSpecialtyById = async (req, res) => {
    try{
        let info = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location)
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
    createSpecialty: createSpecialty,
    getAllSpecialties: getAllSpecialties,
    getDetailSpecialtyById: getDetailSpecialtyById
}