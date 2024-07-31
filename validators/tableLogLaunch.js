const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreate = [
    check('nameModel', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('userId', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('nBots', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreate}