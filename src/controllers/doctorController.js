import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if(!limit) limit = 10
    try{
        let response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try{
        let doctors = await doctorService.getAllDoctor()
        return res.status(200).json(doctors)
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInfoDoctor = async (req, res)=>{
    try{
        console.log(req.body)
        let response = await doctorService.saveDetailInfoDoctor(req.body)
        return res.status(200).json(response)
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })        
    }
}

let getDetailDoctorById = async (req, res) => {
    try{
        if(!req.query.id){
            return res.status(200).json({
                errCode: 3,
                errMessage: "Missing id"
            })
        }
        let info = await doctorService.getDetailDoctorById(req.query.id)
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

let bulkCreateSchedule = async (req, res) => {
    try{
        let info = await doctorService.bulkCreateSchedule(req.body)
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

let getScheduleByDate = async(req, res) => {
    try{
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)       //using req.query to get the parameter on the URL passed  
        return res.status(200).json(                                                               //using req.body when it's POST method (no URL passed)
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
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
}