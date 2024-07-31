const express = require("express");
const router = express.Router();
const { createUserType, getUserType, getUserTypeByID, updateUserType, deleteUserType } = require("../controllers/userType");
const { validateCreateUserType } = require("../validators/userType");

router.post("/", validateCreateUserType, createUserType)
router.get("/", getUserType)
router.get("/:id", getUserTypeByID)
router.put("/:id", updateUserType)
router.delete("/:id", deleteUserType)

module.exports = router