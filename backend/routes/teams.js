const express = require("express");

const TeamsController = require("../controllers/teams");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.get("", TeamsController.getPieCharts);
router.get("/barChart", TeamsController.getBarCharts);
router.get("/teamsTable", TeamsController.getteamsTable);

module.exports = router;
