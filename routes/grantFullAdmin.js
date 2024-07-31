const express = require("express");
const router = express.Router();
const { signUpSuperU, getMeSuperU, GetSuperUByID, GetSuperUByEmail, deleteSuperU, updateSuperU } = require("../controllers/grantFullAdmin");
const { validateCreateSignUp } = require("../validators/grantFullAdmin");
const { verifyToken } = require("../validators/validateToken");

router.post("/signup", validateCreateSignUp, signUpSuperU)
router.get("/byToken", verifyToken, getMeSuperU)
router.get("/:id", GetSuperUByID)
router.get("/email/:email", GetSuperUByEmail)
router.put("/:id", updateSuperU)
router.delete("/:id", deleteSuperU)

module.exports = router