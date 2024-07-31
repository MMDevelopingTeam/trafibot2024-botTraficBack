const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreateBotContainer = [
    check('ip', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('typeBot', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreateBotContainer}