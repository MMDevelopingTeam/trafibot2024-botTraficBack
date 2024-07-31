const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreatePermission = [
    check('namePermission', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreatePermission}