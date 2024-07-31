const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreateAllowedDevices = [
    check('mac', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('company_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreateAllowedDevices}