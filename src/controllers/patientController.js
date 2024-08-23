import patientService from '../services/patientService'

let postBookAppointment = async(req, res)=> {
    try{
        let info = await patientService.postBookAppointment(req.body)   //we are just sending all info to server, thats why req.body not req.query
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
    postBookAppointment: postBookAppointment 
}