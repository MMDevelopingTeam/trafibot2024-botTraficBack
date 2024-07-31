const express = require("express");
const router = express.Router();
const { createPermission, getPermissions, getPermissionByID, deletePermission, updatePermission } = require("../controllers/permissions");
const { validateCreatePermission } = require("../validators/permission");

router.post("/", validateCreatePermission, createPermission)
router.get("/", getPermissions)
router.get("/:id", getPermissionByID)
router.put("/:id", updatePermission)
router.delete("/:id", deletePermission)

module.exports = router