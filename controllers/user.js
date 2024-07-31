const { Server } = require('../classes/server');
const { encrypt, compare } = require('../utils/handleBcrypt')
const userModels = require('../models/user');
const userAdminModels = require('../models/userAdmin');
const superUserModels = require('../models/grantFullAdmin');
const userTypeModels = require('../models/userType');
const companyModels = require('../models/company');
const botContainerCompanysModels = require('../models/botContainerCompanys');
const modelModels = require('../models/models');
const accessLogModels = require('../models/accessLog');
const accessLogAdminModels = require('../models/accessLogAdmin');
const allowedDevicesModels = require('../models/allowedDevices');
const allowedDevicesUserAdminModels = require('../models/allowedDevicesUserAdmin');
const jwt = require('jsonwebtoken');
const { sendNotificationsAccs } = require('../utils/sendNotifications');

const server = Server.instance;

// login
const signIn = async (req, res) => {
    const { email, password, address } = req.body;
    let user = null
    const dataUser = await userModels.findOne({email})
    const dataUserAdmin = await userAdminModels.findOne({email})
    const dataSuperU = await superUserModels.findOne({email})
    if (dataUser || dataUserAdmin || dataSuperU) {
      user=dataUser || dataUserAdmin || dataSuperU
    }else{
      return res.status(404).send({
        success: false,
        message: "El usuario no existe"
      });
    }
    const checkPassword = await compare(password, user.password)
    if (checkPassword) {

      const token = jwt.sign({_id: user._id}, process.env.KEY_JWT, {expiresIn: "12h"})
      if (user.userTypeArray) {
        const newALog = new accessLogModels({
          user: email,
          address,
          hadAccess: true,
          User_idUser: user._id,
          company_idCompany: user.company_idCompany._id
        })
        await newALog.save()
        server.io.emit('updateStats', 'updateStats')
      } 
      if (user.userType) {
        const newALogA = new accessLogAdminModels({
          user: email,
          address,
          hadAccess: true,
          UserAdmin_idUserAdmin: user._id,
          company_idCompany: user.company_idCompany._id
        })
        await newALogA.save()
        server.io.emit('updateStats', 'updateStats')
      }
      return res.status(200).json({
        success: true,
        message: "login exitoso",
        token,
        user
      })
    } else {
      if (user.userTypeArray) {
        const newALog = new accessLogModels({
          user: email,
          address,
          hadAccess: false,
          User_idUser: user._id,
          company_idCompany: user.company_idCompany._id
        })
        await newALog.save()
        server.io.emit('updateStats', 'updateStats')
      } 
      if (user.userType) {
        const newALogA = new accessLogAdminModels({
          user: email,
          address,
          hadAccess: false,
          UserAdmin_idUserAdmin: user._id,
          company_idCompany: user.company_idCompany._id
        })
        await newALogA.save()
        server.io.emit('updateStats', 'updateStats')
      }
      return res.status(403).send({
        success: false,
        message: "Password incorrecto"
      });
    }
}

const NewsignIn = async (req, res) => {
  const { email, password, mac } = req.body;
  let user = null
  const dataUser = await userModels.findOne({email})
  const dataUserAdmin = await userAdminModels.findOne({email})
  const dataSuperU = await superUserModels.findOne({email})
  if (dataUser || dataUserAdmin || dataSuperU) {
    user=dataUser || dataUserAdmin || dataSuperU
  }else{
    return res.status(404).send({
      success: false,
      message: "El usuario no existe"
    });
  }
  const checkPassword = await compare(password, user.password)
  if (checkPassword) {
    if (user.ipFrom) {
      const token = jwt.sign({_id: user._id}, process.env.KEY_JWT, {expiresIn: "12h"})
      return res.status(200).json({
        success: true,
        message: "login exitoso",
        token,
        user
      })
    }else{
      const dataDevice = await allowedDevicesModels.findOne({User_idUser: user._id})
      const dataDeviceA = await allowedDevicesUserAdminModels.findOne({UserAdmin_idUserAdmin: user._id})
      let device = null;
      if (dataDevice || dataDeviceA) {
        device=dataDevice || dataDeviceA
        if (device.mac !== mac) {
          sendNotificationsAccs(user._id, user.company_idCompany, mac);
          return res.status(400).json({
            success: false,
            message: "Hemos enviado una notificación al administrador para validar el dispositivo"
          })
        }else{
          const token = jwt.sign({_id: user._id}, process.env.KEY_JWT, {expiresIn: "12h"})
          if (user.userTypeArray) {
            const newALog = new accessLogModels({
              user: email,
              address: mac,
              hadAccess: true,
              User_idUser: user._id,
              company_idCompany: user.company_idCompany._id
            })
            await newALog.save()
            server.io.emit('updateStats', 'updateStats')
          } 
          if (user.userType) {
            const newALogA = new accessLogAdminModels({
              user: email,
              address: mac,
              hadAccess: true,
              UserAdmin_idUserAdmin: user._id,
              company_idCompany: user.company_idCompany._id
            })
            await newALogA.save()
            server.io.emit('updateStats', 'updateStats')
          }
          return res.status(200).json({
            success: true,
            message: "login exitoso",
            token,
            user
          })
        }
      }else{
        // return res.status(404).send({
        //   success: false,
        //   message: "Dispositivo no encontrado"
        // });
        if (user.userTypeArray) {
          const newALog = new accessLogModels({
            user: email,
            address: mac,
            hadAccess: false,
            User_idUser: user._id,
            company_idCompany: user.company_idCompany._id
          })
          await newALog.save()
          server.io.emit('updateStats', 'updateStats')
        } 
        if (user.userType) {
          const newALogA = new accessLogAdminModels({
            user: email,
            address: mac,
            hadAccess: false,
            UserAdmin_idUserAdmin: user._id,
            company_idCompany: user.company_idCompany._id
          })
          await newALogA.save()
          server.io.emit('updateStats', 'updateStats')
        }
        sendNotificationsAccs(user._id, user.company_idCompany, mac);
        return res.status(400).json({
          success: false,
          message: "Hemos enviado una notificación al administrador para validar el dispositivo"
        })
      }
    }
  } else {
    return res.status(403).send({
      success: false,
      message: "Password incorrecto"
    });
  }
}

// register
const signUp = async (req, res) => {
  
  const { name, user, email, password, userTypeArray, company_idCompany } = req.body;

  // return console.log(userTypeArray[1]);
  try {
    for (let index = 0; index < userTypeArray.length; index++) {
      const dataUserT = await userTypeModels.findOne({_id: userTypeArray[index]})
      if (!dataUserT) {
        return res.status(403).send({
          success: false,
          message: `El tipo de usuario ${userTypeArray[index]} no existe`
        });
      }
      
    }
  } catch (error) {
    return res.status(400).send({
        success: false,
        message: error.message
    });
  }
  try {
      const dataUser = await userModels.findOne({email})
      if (dataUser) {
        return res.status(403).send({
          success: false,
          message: 'El correo ya esta registrado'
        });
      }
      const dataUserAdmin = await userAdminModels.findOne({email})
      if (dataUserAdmin) {
        return res.status(403).send({
          success: false,
          message: 'El correo ya esta registrado'
        });
      }
      const dataC = await companyModels.findOne({_id: company_idCompany})
      if (!dataC) {
        return res.status(403).send({
          success: false,
          message: 'Compañia no encontrada'
        });
      }
      const passwordHash = await encrypt(password)
      const newUser = new userModels({
          name,
          user,
          email,
          password: passwordHash,
          userTypeArray,
          company_idCompany
      });
      await newUser.save();
      const token = jwt.sign({_id: newUser._id }, process.env.KEY_JWT)
    
      return res.status(201).send({
          success: true,
          message: "Usuario creado correctamente",
          token,
          newUser
      });
        
    } catch (error) {
      return res.status(400).send({
          success: false,
          message: error.message
      });
    }
}

// get Type User By Token
const getTypeUserByToken = async (req, res) => {
  const token = req.headers.authorization.split(' ').pop();
  try {
    const payload = jwt.verify(token, process.env.KEY_JWT)
    const id = payload._id
    
    let user = null;
    
    const dataUser = await userModels.findOne({_id: id})
    const dataUserAdmin = await userAdminModels.findOne({_id: id})
    const dataSuperU = await superUserModels.findOne({_id: id})

    if (dataUser || dataUserAdmin || dataSuperU) {
      user=dataUser || dataUserAdmin || dataSuperU
    }else{
      return res.status(404).send({
        success: false,
        message: "El usuario no existe"
      });
    }

    if (user.userTypeArray) {
      return res.status(200).send({
        success: true,
        message: 'Tipo de usuario encontrado exitosamente',
        user: true
      });
    }
    if (user.company_idCompany) {
      return res.status(200).send({
        success: true,
        message: 'Tipo de usuario encontrado exitosamente',
        userAdmin: true
      });
    }
    if (user.ipFrom) {
      return res.status(200).send({
        success: true,
        message: 'Tipo de usuario encontrado exitosamente',
        superUser: true
      });
    }
  } catch (error) {
    return res.status(403).send({
        success: false,
        message: error.message
    });
  }
} 

// get Type User By Token
const TypeUserByToken = async (req, res) => {
  const {token} = req.body;
  try {
    const payload = jwt.verify(token, process.env.KEY_JWT)
    const id = payload._id
    
    let user = null;
    
    const dataUser = await userModels.findOne({_id: id})
    const dataUserAdmin = await userAdminModels.findOne({_id: id})
    const dataSuperU = await superUserModels.findOne({_id: id})

    if (dataUser || dataUserAdmin || dataSuperU) {
      user=dataUser || dataUserAdmin || dataSuperU
    }else{
      return res.status(404).send({
        success: false,
        message: "El usuario no existe"
      });
    }

    if (user.userTypeArray) {
      return res.status(200).send({
        success: true,
        message: 'Tipo de usuario encontrado exitosamente',
        user: true
      });
    }
    if (user.company_idCompany) {
      return res.status(200).send({
        success: true,
        message: 'Tipo de usuario encontrado exitosamente',
        userAdmin: true
      });
    }
    if (user.ipFrom) {
      return res.status(200).send({
        success: true,
        message: 'Tipo de usuario encontrado exitosamente',
        superUser: true
      });
    }
  } catch (error) {
    return res.status(403).send({
        success: false,
        message: error.message
    });
  }
} 

// get user by id
const GetUserByID = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await userModels.findOne({_id: id}).populate({ path: 'userTypeArray' })
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuario traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// get user by user
const GetUserByUser = async (req, res) => {
  const { user, company_idCompany } = req.body
  try {
    const dataUser = await userModels.findOne({user, company_idCompany})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuario traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// get user by user
const GetUserByUserAndUserA = async (req, res) => {
  const { user, company_idCompany } = req.body
  try {
    const dataUserA = await userAdminModels.findOne({user, company_idCompany})
    if (!dataUserA) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuario traido correctamente.",
      dataUserA
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// get by user token
const getMe = async (req, res) => {

  const token = req.headers.authorization.split(' ').pop();
  try {
    const payload = jwt.verify(token, process.env.KEY_JWT)
    const id = payload._id
    const dataUser = await userModels.findOne({ _id: id }).populate({path: 'userTypeArray'})
    if (!dataUser) {
      return res.status(403).send({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    return res.status(200).send({
      success: true,
      message: 'Usuario encontrado exitosamente',
      dataUser
    });
  } catch (error) {
    return res.status(403).send({
        success: false,
        message: error.message
    });
  }
}

// get user by email
const GetUserByEmail = async (req, res) => {
  const { email } = req.params
  if (email === ':email') {
      return res.status(400).send({
          success: false,
          message: "email es requerido"
      });
  }
  try {
    const dataUser = await userModels.findOne({email})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuario traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// get user by Company
const GetUser = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUsers = await userModels.find({company_idCompany: id})
    if (!dataUsers) {
        return res.status(400).send({
            success: false,
            message: "Usuarios no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuarios traidos correctamente.",
      dataUsers
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await userModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    await userModels.deleteOne({_id: id})
    return res.status(200).send({
      success: true,
      message: "Usuario eliminado correctamente."
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

// update user
const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, user, email, password, userTypeArray, company_idCompany } = req.body;
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await userModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    if (name != undefined) {
      dataUser.name=name
    }
    if (user != undefined) {
      dataUser.user=user
    }
    if (email != undefined) {
      dataUser.email=email
    }
    if (password != undefined) {
      dataUser.password=password
    }
    if (userTypeArray != undefined) {
      try {
        for (let index = 0; index < userTypeArray.length; index++) {
          const dataUserT = await userTypeModels.findOne({_id: userTypeArray[index]})
          if (!dataUserT) {
            return res.status(403).send({
              success: false,
              message: `El tipo de usuario ${userTypeArray[index]} no existe`
            });
          }
          
          dataUser.userTypeArray=dataUser.userTypeArray.concat(userTypeArray[index])
        }
      } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message  
        });
      }
    }
    if (company_idCompany != undefined) {
      const dataC = await companyModels.findOne({_id: company_idCompany})
      if (!dataC) {
          return res.status(400).send({
              success: false,
              message: "Sede no encontrada"
          });
      }
      dataUser.company_idCompany=company_idCompany
    }
    await dataUser.save()
    return res.status(200).send({
      success: true,
      message: "Usuario actualizado correctamente."
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

// get token bot
const tokenBot = async (req, res) => {
  const { nameModel, userId, nBots, idRegisterCompBotContainer } = req.body;
  const dataUser = await userModels.findOne({ _id: userId }).populate({path: 'userTypeArray'})
  if (!dataUser) {
    return res.status(400).send({
      success: false,
      message: "Usuario no encontrado."
    });
  }
  const dataModel = await modelModels.findOne({nickname: nameModel, company_idCompany: dataUser.company_idCompany})
  if (!dataModel) {
    return res.status(400).send({
      success: false,
      message: "modelo no encontrada."
    });
  }
  if (dataModel.isAllowed === false) {
    return res.status(400).send({
      success: false,
      message: "modelo no permitida."
    });
  }

  const dataRegister = await botContainerCompanysModels.findOne({ _id: idRegisterCompBotContainer })
  if (!dataRegister) {
    return res.status(400).send({
      success: false,
      message: "Registro no encontrado."
    });
  }
  for (let index = 0; index < dataUser.userTypeArray.length; index++) {
    if (dataUser.userTypeArray[index].nameUserType === 'moderator') {
      break;
    }else{
      return res.status(400).send({
        success: false,
        message: "No tiene autorizacion."
      });
    }
  }
  const dataC = await companyModels.findOne({_id: dataModel.company_idCompany})
  if (!dataC) {
    return res.status(400).send({
      success: false,
      message: "Compañia no encontrada."
    });
  }

  try {
    const token = jwt.sign({nameModel, userId, company: dataModel.company_idCompany, nBots, typeBot: dataRegister.registerLicenses.licenses_idLicense.type, idRegisterCompBotContainer}, process.env.KEY_JWT)
    return res.status(200).send({
      success: true,
      message: "Token creado correctamente",
      token
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

// get token killBot
const tokenKillBot = async (req, res) => {
  const { nameModel, userId, nBots, idRegisterCompBotContainer } = req.body;
  const dataUser = await userModels.findOne({ _id: userId }).populate({path: 'userTypeArray'})
  if (!dataUser) {
    return res.status(400).send({
      success: false,
      message: "Usuario no encontrado."
    });
  }
  const dataModel = await modelModels.findOne({nickname: nameModel, company_idCompany: dataUser.company_idCompany})
  if (!dataModel) {
    return res.status(400).send({
      success: false,
      message: "modelo no encontrada."
    });
  }
  if (dataModel.isAllowed === false) {
    return res.status(400).send({
      success: false,
      message: "modelo no permitida."
    });
  }

  const dataRegister = await botContainerCompanysModels.findOne({ _id: idRegisterCompBotContainer })
  if (!dataRegister) {
    return res.status(400).send({
      success: false,
      message: "Registro no encontrado."
    });
  }
  for (let index = 0; index < dataUser.userTypeArray.length; index++) {
    if (dataUser.userTypeArray[index].nameUserType === 'moderator') {
      break;
    }else{
      return res.status(400).send({
        success: false,
        message: "No tiene autorizacion."
      });
    }
  }
  const dataC = await companyModels.findOne({_id: dataModel.company_idCompany})
  if (!dataC) {
    return res.status(400).send({
      success: false,
      message: "Compañia no encontrada."
    });
  }
  try {
    const token = jwt.sign({nameModel, userId, nBots, idRegisterCompBotContainer}, process.env.KEY_JWT)
    return res.status(200).send({
      success: true,
      message: "Token creado correctamente",
      token
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

// verifyToken
const verifyTokenR = async (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.KEY_JWT, (err, authData) => {
    if (err) {
          return res.status(200).send({
            success: false
          });
    }else{
        return res.status(200).send({
            success: true,
            authData
          });
    }
})
}

// refresh token
const refreshToken = async (req, res) => {
  const { token, id } = req.body;
  jwt.verify(token, process.env.KEY_JWT, (err, authData) => {
    if (err) {
        return res.status(400).send({
          success: false,
          message: err.message
        });
    }else{
        if (authData._id === id) {
          const newToken = jwt.sign({_id: id}, process.env.KEY_JWT, {expiresIn: "6h"})
          return res.status(200).send({
            success: true,
            newToken
          });
        }else{
          return res.status(400).send({
            success: false,
            message: "error en el token"
          });
        }
    }
})
}

const getAccesslogs = async (req, res) => {
  try {
    const dataA = await accessLogModels.find({hadAccess: true}).sort({loginDate: -1})
    return res.status(200).send({
      success: true,
      dataA
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}
const getAccesslogsFalse = async (req, res) => {
  try {
    const dataA = await accessLogModels.find({hadAccess: false}).sort({loginDate: -1})
    return res.status(200).send({
      success: true,
      dataA
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  signIn, 
  verifyTokenR, 
  refreshToken,
  TypeUserByToken,
  getAccesslogs,
  getAccesslogsFalse,
  NewsignIn, 
  signUp, 
  GetUserByID,
  GetUser, 
  GetUserByEmail, 
  getMe, 
  GetUserByUser, 
  GetUserByUserAndUserA, 
  deleteUser, 
  updateUser, 
  tokenKillBot, 
  tokenBot, 
  getTypeUserByToken
};