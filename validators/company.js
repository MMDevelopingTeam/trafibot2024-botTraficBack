const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreateCompany = [
    check('nameCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('typeCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('license_idLicense', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreateCompany}