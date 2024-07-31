const express = require("express");
const router = express.Router();
const { createCompany, getCompanys, getCompanyByID, updateCompany, deleteCompany } = require("../controllers/company");
const { validateCreateCompany } = require("../validators/company");
const { verifyToken } = require("../validators/validateToken");


router.post("/", validateCreateCompany, createCompany)
router.get("/", verifyToken, getCompanys)
router.get("/:id", getCompanyByID)
router.put("/:id", updateCompany)
router.delete("/:id", deleteCompany)

module.exports = router