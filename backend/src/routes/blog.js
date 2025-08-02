import { Router } from "express";
import * as blogController from "../controllers/blog.js";
import controlAccess from "../middleware/controlAccess.js";

const blogRouter = Router();

// Get all the blogs
blogRouter.get("/", blogController.getAllBlogs);

// Get single blog
blogRouter.get("/:id", blogController.getBlogById);

// Get blog by user id
blogRouter.get("/user-blog/:user_id", blogController.getBlogsByUser);

// Create a blog (accessible by authenticated members)
blogRouter.post(
  "/post-blog",
  controlAccess(["member", "teacher", "admin"]),
  blogController.createBlog
);

// Update a blog (accessible by authenticated members)
blogRouter.put(
  "/update-blog/:id",
  controlAccess(["member", "teacher", "admin"]),
  blogController.updateBlog
);

// Delete a blog (accessible by authenticated members)
blogRouter.delete(
  "/delete-blog/:id",
  controlAccess(["member", "teacher", "admin"]),
  blogController.deleteBlog
);

export default blogRouter;
