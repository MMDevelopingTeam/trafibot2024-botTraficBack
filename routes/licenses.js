const express = require("express");
const router = express.Router();
const { createLicense, updateLicense, getLicenseByID, getLicenses, deleteLicense } = require("../controllers/licenses");
const { validateCreateLicense } = require("../validators/licenses");

router.post("/", validateCreateLicense, createLicense)
router.get("/", getLicenses)
router.get("/:id", getLicenseByID)
router.put("/:id", updateLicense)
router.delete("/:id", deleteLicense)

module.exports = router