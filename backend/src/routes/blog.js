import { Router } from "express"
import * as blogController from "../controllers/blog.js"

const blogRouter = Router()

// Get all the blogs
blogRouter.get("/", blogController.getAllBlogs)
// Get single blog
blogRouter.get("/:id", blogController.getBlogById)
// Get blog by user id 
blogRouter.get("/user-blog/:user_id", blogController.getBlogsByUser)
// Create a blog
blogRouter.post("/post-blog", blogController.createBlog)
// Delete a blog
blogRouter.delete("/delete-blog/:id", blogController.deleteBlog)



export default blogRouter;