import db from "../models/index"
import { raw } from 'body-parser';
import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10);


let hashUserPassword = (password) => {
    console.log(password)
    return new Promise(async(resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);  //since at this point we need to wait for the library to hash the password
            resolve(hashPassword)
        }catch(e){
            reject(e)
        }
    })
}


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

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject)=> {
        try{
            let users = ''
            console.log(userId)
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id : userId},
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }catch(e){
            reject(e)
        }
    })
}

let createNewUser = (data) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            
            //check email if exists
            let check = await checkUserEmail(data.email)
            if(check){
                resolve({
                    errCode: 1,
                    message: 'already in used, try another email'
                })
            }

            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1'? true : false,
                roleId: data.roleId,
            })
            resolve({
                errCode: 0,
                message : 'ok'
            })
        }catch(e){
            reject(e)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {

        let user = await db.User.findOne({
            where: {id: userId}
        })
        if(!user){
            resolve({
                errCode: 2,
                errMessage:"User not exist"
            })
        }

        await db.User.destroy({
            where: {id: userId}
        })
        resolve({
            errCode: 0,
            message: "user deleted"
        })
        
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
}