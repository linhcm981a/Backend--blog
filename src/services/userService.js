import db from '../models/index';
import bcrypt from 'bcryptjs';




let handleUserLogin = ( email, password ) => {
        return new Promise( async (resolve , reject ) => {
                        try {
                            let userData = {};


                            let isExist  = await checkUserEmail(email);
                            if(isExist) {
                                    //User already exist
                               
                                    let user = await db.User.findOne({
                                        attributes: ['email', 'roleId', 'password'],
                                        where: { email : email },
                                        raw: true
                                   
                                    });
                                    if(user) {
                                                  //compare password  
                                          let check = await bcrypt.compareSync(password, user.password); 
                                          if(check){
                                              userData.errCode  = 0 ;
                                              user.Data.errMessage = `oke`;
                                            delete user.password;
                                              user.Data.user = user;
                                          }else {
                                              userData.errCode = 3;
                                             userData.errMessage = `Wrong password`;
                                           
                                          }
                                    } else {
                                        userData.errCode = 2;
                                        userData.errMessage = `user not found`;
                                 
                                    }
                               
                            }else {
                                    //return error 
                                    userData.errCode = 1;
                                    userData.errMessage = `your email not exist in your system`;
                            }
                            resolve (userData);
                        } catch (e) {
                            reject(e)
                        }
        })
}

let checkUserEmail = ( userEmail) => {
            return new Promise( async (resolve, reject) => {
                try {
                        let user = await  db.User.findOne({
                                where: { email : userEmail }
                        })
                        if(user) {
                            resolve(true)
                        }else {
                            resolve(false)
                        }
                } catch (e) {
                    reject(e);
                }
            })
}

module.exports = {
    handleUserLogin:handleUserLogin,
}