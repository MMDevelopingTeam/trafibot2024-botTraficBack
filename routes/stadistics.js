const express = require("express");
const { getAllActs, getAllComp, getAllLicences, getAllModels, getAllplatforms, getAllusers, getAllusersAdmin, getAllStatsAdmin } = require("../controllers/stadistics");
const { cacheInit } = require("../middleware/cache");
const router = express.Router();

router.get("/", cacheInit, getAllActs)
router.get("/getAllComp", cacheInit, getAllComp)
router.get("/getAllStatsAdmin/:id", cacheInit, getAllStatsAdmin)
router.get("/getAllLicences", cacheInit, getAllLicences)
router.get("/getAllModels", cacheInit, getAllModels)
router.get("/getAllplatforms", cacheInit, getAllplatforms)
router.get("/getAllusers", cacheInit, getAllusers)
router.get("/getAllusersAdmin", cacheInit, getAllusersAdmin)

module.exports = router