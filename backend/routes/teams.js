const express = require("express");

const TeamsController = require("../controllers/teams");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

// router.post("", checkAuth, extractFile, PostController.createPost);

// router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get("", TeamsController.getPieCharts);
router.get("/barChart", TeamsController.getBarCharts);
router.get("/teamsTable", TeamsController.getteamsTable);

// router.get("/:id", PostController.getPost);

// router.delete("/:id", checkAuth, PostController.deletePost);

// router.get("/like/:id", PostController.likePost);


module.exports = router;
