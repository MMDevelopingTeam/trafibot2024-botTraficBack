const express = require("express");
const router = express.Router();
const { createModel, getModel, getModelByID, updateModel, deleteModel, getModelsByIDCompany, getModelByIDPlatform, getKillbotsByModel, getModelFull } = require("../controllers/model");
const { validateCreateModel, validateGetPlatform, validateGetModelFull } = require("../validators/model");

router.post("/", validateCreateModel, createModel)
router.get("/", getModel)
router.get("/:id", getModelByID)
router.get("/byCompany/:id", getModelsByIDCompany)
router.post("/getKillBotsByModel", getKillbotsByModel)
router.post("/platform/:id", validateGetPlatform, getModelByIDPlatform)
router.post("/getModelFull", validateGetModelFull, getModelFull)
router.put("/:id", updateModel)
router.delete("/:id", deleteModel)

module.exports = router