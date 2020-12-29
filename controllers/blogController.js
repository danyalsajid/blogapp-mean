// models
const User = require("../models/user");
const Blog = require("../models/blog");

exports.blog_profile = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      Blog.find({ username: user.username })
        .then((blogs) => {
          const userData = {
            username: user.username,
            email: user.email,
            blogs: blogs,
          };
          res.status(200).json(userData);
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.blog_create = (req, res, next) => {
  const blog = new Blog({
    username: req.body.username,
    title: req.body.title,
    description: req.body.description,
  });
  blog
    .save()
    .then((result) => {
      res.status(201).json({ success: true, msg: "Blog created." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.blog_all_blogs = (req, res, next) => {
  const page = +req.query.page;
  const pageSize = +req.query.pageSize;

  Blog.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .then((blogs) => {
      if (!blogs) {
        const error = new Error("Could not find any blogs.");
        error.statusCode = 404;
        throw error;
      }
      // calculate the count for pagination
      Blog.countDocuments()
        .then((count) => {
          res.status(200).json({ blogs: blogs, count: count });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.blog_detail = (req, res, next) => {
  const blogId = req.params.blogId;
  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        const error = new Error("Could not find the blog.");
        error.statusCode = 404;
        throw error;
      }
      const blogDetails = {
        id: blog._id,
        title: blog.title,
        description: blog.description,
        username: blog.username,
        createdAt: blog.createdAt,
      };
      res.status(200).json(blogDetails);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.blog_delete = (req, res, next) => {
  const blogId = req.params.blogId;
  Blog.findByIdAndDelete(blogId)
    .then((result) => {
      res.status(200).json({ success: true, msg: "Delete successfull." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.blog_update = (req, res, next) => {
  const blogId = req.params.blogId;
  Blog.findById(blogId)
    .then((blog) => {
      if (!blog) {
        const error = new Error("Could not find the blog.");
        error.statusCode = 404;
        throw error;
      }
      blog.title = req.body.title;
      blog.description = req.body.description;
      return blog.save();
    })
    .then((result) => {
      res.status(200).json({ msg: "Blog updated!", blog: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
