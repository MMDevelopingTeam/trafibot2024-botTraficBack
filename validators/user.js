const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreateSignIn = [
    check('email', 'El campo es de tipo email')
    .exists()
    .isEmail(),
    check('password', 'El password es de minimo 6 caracteres')
    .exists()
    .isLength({min: 6}),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateGetUser = [
    check('email', 'El campo es de tipo email')
    .exists()
    .isEmail()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateCreateSignUp = [
    check('user', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('email', 'El campo es de tipo email')
    .exists()
    .isEmail(),
    check('password', 'El password es de minimo 6 caracteres')
    .exists()
    .isLength({min: 6}),
    check('name', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('userTypeArray', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('company_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateCreateSignUpAdmin = [
    check('user', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('name', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('email', 'El campo es de tipo email')
    .exists()
    .isEmail(),
    check('password', 'El password es de minimo 6 caracteres')
    .exists()
    .isLength({min: 6}),
    check('company_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateCreateToken = [
    check('nameModel', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('userId', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('nBots', 'El campo es Numérico')
    .exists()
    .isNumeric()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateGetUserByU = [
    check('user', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('company_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreateSignIn, validateCreateSignUpAdmin, validateGetUserByU, validateCreateToken, validateGetUser, validateCreateSignUp}