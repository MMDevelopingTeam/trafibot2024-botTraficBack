const { check } = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCreateLicense = [
    check('nameLicense', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('monthsDuration', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('type', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('platform_idPlatform', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('numberAccts', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]
const validateCreateRegisterLicense = [
    check('initialDateLicense', 'El campo es de tipo fecha YYYY/M/D')
    .exists()
    .notEmpty(),
    check('licenses_idLicense', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('companys_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateGetLicencesPlatform = [
    check('companys_idCompany', 'El campo es requerido')
    .exists()
    .notEmpty(),
    check('platforms_idPlatform', 'El campo es requerido')
    .exists()
    .notEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCreateRegisterLicense, validateCreateLicense, validateGetLicencesPlatform}