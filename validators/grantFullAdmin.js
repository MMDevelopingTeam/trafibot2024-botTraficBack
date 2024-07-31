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
    check('email', 'El campo es de tipo email')
    .exists()
    .isEmail(),
    check('password', 'El password es de minimo 6 caracteres')
    .exists()
    .isLength({min: 6}),
    check('ipFrom', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('latFrom', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('lonFrom', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]


module.exports = {validateCreateSignIn, validateGetUser, validateCreateSignUp}