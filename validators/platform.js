const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreatePlatform = [
    check('namePlatform', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreatePlatform}