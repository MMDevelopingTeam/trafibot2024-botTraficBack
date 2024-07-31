const express = require("express");
const router = express.Router();
const {createWorkDay, getWorkDay, getWorkDayByID, updateWorkDay, deleteWorkDay} = require("../controllers/workDay");
const { validateCreateWorkDay } = require("../validators/workDay");

router.post("/", validateCreateWorkDay, createWorkDay)
router.get("/", getWorkDay)
router.get("/:id", getWorkDayByID)
router.put("/:id", updateWorkDay)
router.delete("/:id", deleteWorkDay)

module.exports = router