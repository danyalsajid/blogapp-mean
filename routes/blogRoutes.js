const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");
const isAuth = require("../middleware/is-auth");


router.get("/profile/:userId", isAuth, blogController.blog_profile);
router.get("/all-blogs", blogController.blog_all_blogs);
router.post("/create-blog", isAuth, blogController.blog_create);
router.get("/blog-detail/:blogId", blogController.blog_detail);
router.delete("/delete-blog/:blogId",isAuth, blogController.blog_delete);
router.put("/update-blog/:blogId",isAuth, blogController.blog_update);

module.exports = router;
