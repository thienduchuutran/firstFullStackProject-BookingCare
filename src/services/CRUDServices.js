import bcrypt from 'bcrypt';
import db from '../models';
import { raw } from 'body-parser';
const salt = bcrypt.genSaltSync(10);


let createNewUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try{
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
            resolve('ok create a new user successfully')
        }catch(e){
            reject(e)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try{
            var hashPassword = await bcrypt.hashSync(password, salt);  //since at this point we need to wait for the library to hash the password
            resolve(hashPassword)
        }catch(e){
            reject(e)
        }
    })
}

let getAllUser = (req, res) => {
    return new Promise(async(resolve, reject) => {
        try{
            let users = await db.User.findAll({
                raw: true
            })
            resolve(users)
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
}