const { encrypt, compare } = require('../utils/handleBcrypt')
const userModels = require('../models/user');
const superUserModels = require('../models/grantFullAdmin');
const userAdminModels = require('../models/userAdmin');

const jwt = require('jsonwebtoken');

// register
const signUpSuperU = async (req, res) => {
  
  const { email, password, ipFrom, latFrom, lonFrom } = req.body;

  try {
      const SuperU = await superUserModels.findOne({email})
      if (SuperU) {
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
      const dataUserAdmin = await userAdminModels.findOne({email})
      if (dataUserAdmin) {
        return res.status(403).send({
          success: false,
          message: 'El correo ya esta registrado'
        });
      }
      const passwordHash = await encrypt(password)
      const newUser = new superUserModels({
          email,
          password: passwordHash,
          ipFrom,
          latFrom, 
          lonFrom
      });
      await newUser.save();
      const token = jwt.sign({_id: newUser._id }, process.env.KEY_JWT)
    
      return res.status(201).send({
          success: true,
          message: "Super usuario creado correctamente",
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

// get SuperU by id
const GetSuperUByID = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await superUserModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Super usuario no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Super usuario traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// get by SuperU token
const getMeSuperU = async (req, res) => {

  const token = req.headers.authorization.split(' ').pop();
  try {
    const payload = jwt.verify(token, process.env.KEY_JWT)
    const id = payload._id
    const dataUser = await superUserModels.findOne({ _id: id })
    if (!dataUser) {
      return res.status(403).send({
        success: false,
        message: 'Super usuario no encontrado'
      });
    }
    return res.status(200).send({
      success: true,
      message: 'Super usuario encontrado exitosamente',
      dataUser
    });
  } catch (error) {
    return res.status(403).send({
        success: false,
        message: error.message
    });
  }
}

// get SuperU by email
const GetSuperUByEmail = async (req, res) => {
  const { email } = req.params
  if (email === ':email') {
      return res.status(400).send({
          success: false,
          message: "email es requerido"
      });
  }
  try {
    const dataUser = await superUserModels.findOne({email})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Super usuario no encontrado"
        });
    }
    return res.status(200).send({
      success: true,
      message: "Super usuario traido correctamente.",
      dataUser
  });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
  });
  }
}

// delete SuperU
const deleteSuperU = async (req, res) => {
  const { id } = req.params
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await superUserModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Super usuario no encontrado"
        });
    }
    await userModels.deleteOne({_id: id})
    return res.status(200).send({
      success: true,
      message: "Super usuario eliminado correctamente."
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

// update SuperU
const updateSuperU = async (req, res) => {
  const { id } = req.params
  const { email, lastConnection, last2Connection, last3Connection, ipFrom, latFrom, lonFrom } = req.body;
  if (id === ':id') {
      return res.status(400).send({
          success: false,
          message: "id es requerido"
      });
  }
  try {
    const dataUser = await superUserModels.findOne({_id: id})
    if (!dataUser) {
        return res.status(400).send({
            success: false,
            message: "Usuario no encontrado"
        });
    }
    if (email != undefined) {
        dataUser.email=email
    }
    if (lastConnection != undefined) {
      dataUser.lastConnection=lastConnection
    }
    if (last2Connection != undefined) {
      dataUser.last2Connection=last2Connection
    }
    if (last3Connection != undefined) {
      dataUser.last3Connection=last3Connection
    }
    if (ipFrom != undefined) {
      dataUser.ipFrom=ipFrom
    }
    if (latFrom != undefined) {
      dataUser.latFrom=latFrom
    }
    if (lonFrom != undefined) {
      dataUser.lonFrom=lonFrom
    }
    await dataUser.save()
    return res.status(200).send({
      success: true,
      message: "Super usuario actualizado correctamente."
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

module.exports = { signUpSuperU, getMeSuperU, GetSuperUByID, GetSuperUByEmail, deleteSuperU, updateSuperU };