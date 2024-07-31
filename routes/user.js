const express = require("express");
const router = express.Router();
const { signIn, signUp, GetUserByID, deleteUser, updateUser, GetUserByEmail, getMe, GetUser, tokenBot, verifyTokenR, tokenKillBot, getTypeUserByToken, GetUserByUser, GetUserByUserAndUserA, NewsignIn, refreshToken, TypeUserByToken, getAccesslogs, getAccesslogsFalse, GetUserByIDcomp } = require("../controllers/user");
const { validateCreateSignIn, validateCreateSignUp, validateCreateToken, validateGetUserByU } = require("../validators/user");
const { verifyToken } = require("../validators/validateToken");

router.post("/signin", validateCreateSignIn, signIn)
router.post("/signinApp", NewsignIn)
router.post("/verifyToken", verifyTokenR)
router.post("/refreshToken", refreshToken)
router.post("/signup", validateCreateSignUp, signUp)
router.get("/getTypeUserByToken", verifyToken, getTypeUserByToken)
router.post("/TypeUserByToken", TypeUserByToken)
router.get("/byToken", verifyToken, getMe)
router.get("/getAccesslogs", getAccesslogs)
router.get("/getAccesslogsFalse", getAccesslogsFalse)
router.post("/getTokenBot", validateCreateToken, tokenBot)
router.post("/getTokenBotAny", validateCreateToken, tokenBot)
router.post("/getTokenBotMixed", validateCreateToken, tokenBot)
router.post("/getTokenkillBot", validateCreateToken, tokenKillBot)
router.post("/getTokenkillBotAny", validateCreateToken, tokenKillBot)
router.get("/:id", GetUserByID)
router.post("/getUser", validateGetUserByU, GetUserByUser)
router.post("/getUserAndUserA", validateGetUserByU, GetUserByUserAndUserA)
router.get("/companyId/:id", verifyToken, GetUser)
router.get("/email/:email", GetUserByEmail)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

module.exports = router