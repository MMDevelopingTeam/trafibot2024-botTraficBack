const express = require("express");
const { createAllowedDevices, getAllowedDevices, getAllowedDevicesByID, updateAllowedDevices, deleteAllowedDevices, getAllowedDevicesByIp, getAllowedDevicesByIdUser, AllowAccess, createAllowedDevicesUserAdmin, AllowAccessUSerA } = require("../controllers/allowedDevices");
const { validateCreateAllowedDevices } = require("../validators/allowedDevices");
const router = express.Router();

router.post("/", validateCreateAllowedDevices, createAllowedDevices)
router.post("/createAllowedDevicesUserAdmin", validateCreateAllowedDevices, createAllowedDevicesUserAdmin)
router.get("/", getAllowedDevices)
router.post("/AllowAccess", AllowAccess)
router.post("/AllowAccessUSerA", AllowAccessUSerA)
router.get("/:id", getAllowedDevicesByID)
router.get("/ByIdUser/:id", getAllowedDevicesByIdUser)
router.get("/ByIp:ip", getAllowedDevicesByIp)
router.put("/:id", updateAllowedDevices)
router.delete("/:id", deleteAllowedDevices)

module.exports = router