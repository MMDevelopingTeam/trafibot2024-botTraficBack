const express = require("express");
const router = express.Router();
const { cacheInit } = require("../middleware/cache");
const { createBotContainer, getBotContainer, getBotContainerByID, updateBotContainer, deleteBotContainer, updateBotContainerByIP, getBotContainerByIDCompany, updateBotContainerArrayComp, getRegisterCompanyBotContainer, getBotContainerByIP, validIdPackProxy } = require("../controllers/botContainer");
const { validateCreateBotContainer } = require("../validators/botContainer");

router.post("/", validateCreateBotContainer, createBotContainer)
router.get("/", cacheInit, getBotContainer)
router.get("/:id", getBotContainerByID)
router.get("/ByIp/:ip", getBotContainerByIP)
router.get("/byIdCompany/:id", getBotContainerByIDCompany)
router.get("/validIdPackProxy/:id", validIdPackProxy)
router.get("/getRegisterCompanyBotContainer/:id", getRegisterCompanyBotContainer)
router.put("/updateByIp/:ip", updateBotContainerByIP)
router.put("/updateAccts/:id", updateBotContainerArrayComp)
router.put("/:id", updateBotContainer)
router.delete("/:id", deleteBotContainer)

module.exports = router