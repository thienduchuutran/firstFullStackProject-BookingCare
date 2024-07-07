import bcrypt from 'bcrypt';
import db from "../models/index"
import { raw } from 'body-parser';

let handleUserLogin = (email, password)=>{
    return new Promise(async(resolve, reject) => {
        try{
            let userData = {}
            
            let isExist = await checkUserEmail(email)
            console.log('password: ' , password)
            if(isExist){
                //user existed
                
                let user = await db.User.findOne({
                    where: {email : email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                    
                })

                
                if(user){
                    //compare password, that means we have to get the password from client 
                    let check = await bcrypt.compareSync(password, user.password);

                    if(check){
                        userData.errCode = 0
                        userData.errMessage = 'ok'
                        delete user.password    
                        userData.user = user
                        
                    }else{
                        userData.errCode = 3
                        userData.errMessage = 'wrong password'
                    }
                }else{
                    userData.errCode = 2
                    userData.errMessage = 'user not exist'
                }
            }else{
                //return error
                userData.errCode = 1
                userData.errMessage = 'email non exist'
            }   
            resolve(userData)
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