import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10);


let createNewUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
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

module.exports = {
    createNewUser: createNewUser
}