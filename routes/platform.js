
const express = require("express");
const router = express.Router();
const { createPlatform, getPlatform, getPlatformByID, updatePlatform, deletePlatform, getPlatformByName } = require("../controllers/platform");
const { validateCreatePlatform } = require("../validators/platform");

router.post("/", validateCreatePlatform, createPlatform)
router.get("/", getPlatform)
router.get("/:id", getPlatformByID)
router.get("/findByName/:name", getPlatformByName)
router.put("/:id", updatePlatform)
router.delete("/:id", deletePlatform)

module.exports = router