import db from "../models/index"

let handleUserLogin = (email, password)=>{
    return new Promise(async(resolve, reject) => {
        try{
            let userData = {}
            console.log(email)
            let isExist = await checkUserEmail(email)
            if(isExist){
                //user existed
                //compare password
                resolve()
            }else{
                //return error
                userData.errCode = 1
                userData.errMessage = 'email non exist'
                resolve(userData)
            }
        }catch(e){
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {email : userEmail}
            })
            
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin
}