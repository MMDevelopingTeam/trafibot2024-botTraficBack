const express = require("express");
const router = express.Router();
const { signIn, signUp, GetUserAdminByID, deleteUserAdmin, updateUserAdmin, GetUserAdminByEmail, getMe, updateUserAdminIsconfigFull, GetUserAdminByCompany, resetPassword, getAccesslogs, getAccesslogsFalse } = require("../controllers/userAdmin");
const { validateCreateSignIn, validateCreateSignUpAdmin, validateGetUser } = require("../validators/user");
const { verifyToken } = require("../validators/validateToken");

router.post("/signin", validateCreateSignIn, signIn)
router.post("/signup", validateCreateSignUpAdmin, signUp)
router.get("/byToken", verifyToken, getMe)
router.get("/getAccesslogs", getAccesslogs)
router.get("/getAccesslogsFalse", getAccesslogsFalse)
router.get("/:id", GetUserAdminByID)
router.get("/resetPass/:id", resetPassword)
router.get("/company/:id", GetUserAdminByCompany)
router.get("/email/:email", GetUserAdminByEmail)
router.put("/:id", updateUserAdmin)
router.delete("/:id", deleteUserAdmin)

module.exports = router