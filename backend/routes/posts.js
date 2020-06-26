const express = require("express");

const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:userId", checkAuth, extractFile, PostController.updatePost);
router.put("/myPosts/:userId", checkAuth, extractFile, PostController.updateMyPost);

router.get("",  PostController.getPosts);
router.get("/myPosts/:id",  PostController.getMyPosts);

router.get("/:id", PostController.getPost);
router.get("/myPosts/:id/:userId", PostController.getMyPost);
router.post("/myProfile/", PostController.updateMyProfile);

router.delete("/:postId/:userId", checkAuth, PostController.deletePost);

router.get("/like/:id", PostController.likePost);
router.post("/groupName", PostController.addGroup);
router.get("/groupName/:id", PostController.getGroup);
router.delete("/groupName/:groupName/:userId", PostController.deleteGroup);


module.exports = router;
