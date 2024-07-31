const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreateUserType = [
    check('nameUserType', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('permissionsArray', 'El campo es requerido')
    .exists()
    .isArray(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreateUserType}