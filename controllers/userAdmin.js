const { encrypt, compare } = require('../utils/handleBcrypt')
const userAdminModels = require('../models/userAdmin');
const userModels = require('../models/user');
const companyModels = require('../models/company');
const accessLogAdminModels = require('../models/accessLogAdmin');
const jwt = require('jsonwebtoken');

// login
const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user =  await userAdminModels.findOne({email})
    if (!user) return res.status(404).send({
      success: false,
      message: "El usuario admin no existe"
    });

    const checkPassword = await compare(password, user.password)
    if (checkPassword) {
      const token = jwt.sign({_id: user._id}, process.env.KEY_JWT)
      return res.status(200).json({
        success: true,
        message: "login exitoso",
        token,
        user
      })
    } else {
      return res.status(403).send({
        success: false,
        message: "Password incorrecto"
      });
    }
}
// register
const signUp = async (req, res) => {
  
  const { name, user, email, password, company_idCompany } = req.body;
  try {
      const dataUserAdmin = await userAdminModels.findOne({email})
      if (dataUserAdmin) {
        return res.status(403).send({
          success: false,
          message: 'El correo ya esta registrado'
        });
      }
      const dataUser = await userModels.findOne({email})
      if (dataUser) {
        return res.status(403).send({
          success: false,
          message: 'El correo ya esta registrado'
        });
      }
      const dataComp = await companyModels.findOne({_id: company_idCompany})
      if (!dataComp) {
        return res.status(403).send({
          success: false,
          message: 'compañia no encontrada'
        });
      }
      const passwordHash = await encrypt(password)
      const newUser = new userAdminModels({
          name,
          user,
          email,
          password: passwordHash,
          company_idCompany
      });
      await newUser.save();
      const token = jwt.sign({_id: newUser._id }, process.env.KEY_JWT)
    
      return res.status(201).send({
          success: true,
          message: "Usuario admin creado correctamente",
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
// get userAdmin by id
const GetUserAdminByID = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await userAdminModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario admin no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuario admin traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// get userAdmin by company
const GetUserAdminByCompany = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await userAdminModels.find({company_idCompany: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuarios admin no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuarios admin traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// reset password

const resetPassword = async (req, res) => {

  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }

  const password = '123456'
  const passwordHash = await encrypt(password)
  const dataU = await userAdminModels.findOne({_id: id})
  if (!dataU) {
    return res.status(403).send({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  dataU.password=passwordHash
  await dataU.save();
  return res.status(200).send({
    success: true,
    message: 'Password actualizado exitosamente'
  });
}

// get by user token
const getMe = async (req, res) => {

  const token = req.headers.authorization.split(' ').pop();
  try {
    const payload = jwt.verify(token, process.env.KEY_JWT)
    const id = payload._id
    const dataUser = await userAdminModels.findOne({ _id: id })
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

// get userAdmin by Email
const GetUserAdminByEmail = async (req, res) => {
  const { email } = req.params
  if (email === ':email') {
      return res.status(400).send({
          success: false,
          message: "email es requerido"
      });
  }
  try {
    const dataUser = await userAdminModels.findOne({email})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario admin no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Usuario admin traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}
// delete userAdmin
const deleteUserAdmin = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await userAdminModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario admin no encontrado"
        });
    }
    await userAdminModels.deleteOne({_id: id})
    return res.status(200).send({
      success: true,
      message: "Usuario admin eliminado correctamente."
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}
// update userAdmin
const updateUserAdmin = async (req, res) => {
  const { id } = req.params
  const { name, user, email, company_idCompany } = req.body;
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await userAdminModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario admin no encontrado"
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
      if (company_idCompany != undefined) {
      const dataComp = await companyModels.findOne({_id: company_idCompany})
      if (!dataComp) {
          return res.status(400).send({
              success: false,
              message: "Compañia no encontrada"
          });
      }
      dataUser.company_idCompany=company_idCompany
    }
    await dataUser.save()
    return res.status(200).send({
      success: true,
      message: "Usuario admin actualizado correctamente."
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

const getAccesslogs = async (req, res) => {
  try {
    const dataA = await accessLogAdminModels.find({hadAccess: true}).sort({loginDate: -1})
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
    const dataA = await accessLogAdminModels.find({hadAccess: false}).sort({loginDate: -1})
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

module.exports = {signIn, signUp, getAccesslogs, GetUserAdminByID, getAccesslogsFalse, resetPassword, GetUserAdminByEmail, getMe, deleteUserAdmin, GetUserAdminByCompany, updateUserAdmin};