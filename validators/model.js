const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreateModel = [
    check('nickname', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('platforms_idPlatform', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('company_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateGetPlatform = [
    check('nickname', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateGetModelFull = [
    check('nickname', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('platforms_idPlatform', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('company_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateGetPlatform, validateCreateModel, validateGetModelFull}