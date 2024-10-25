import * as blogModel from '../models/blog.js';

// Get all blog posts
export async function getAllBlogs(req, res) {
  try {
    const result = await blogModel.getAllBlogs();
    
    if (result.length === 0) {
      return res.status(404).json({ 
        status: 404,
        message: 'No Blogs found.'
    });
    }

    res.status(200).json({ 
        status: 200,
        data: result 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
        error: 'Failed to fetch posts.' 
    });
  }
}

// Get a single blog post by ID
export async function getBlogById(req, res) {
    const { id } = req.params;
  
    try {
      const result = await blogModel.getBlogById(id);
      console.log(result)
  
      if (result.length === 0) {
        return res.status(404).json({ 
            status: 404,
            error: "No Blogs Found" 
        });
      }
  
      res.status(200).json({ 
        status: 200,
        data: result 
    });
    } catch (error) {
      console.error('Error fetching the post:', error);
      res.status(500).json({ 
        status: 500,
        error: 'Failed to fetch the post.' 
    });
    }
  }

// Get blogs by user ID
export async function getBlogsByUser(req, res) {
  const { user_id } = req.params; // Extract user_id from the request

  try {
    const result = await blogModel.getBlogsByUserId(user_id);
    console.log(result)

    if (result.length === 0) {
      return res.status(404).json({ 
        status: 404,
        message: "No Blogs Found" });
    }

    res.status(200).json({ 
        status: 200,
        data: result });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ 
        status: 500,
        error: 'Failed to fetch user blogs.' });
  }
}

// Create a new blog post
export async function createBlog(req, res) {
  const { user_id, blog_title, blog_content } = req.body;
  try {
    const result = await blogModel.createBlog(user_id, blog_title, blog_content);

    if (result.error) {
      return res.status(400).json({ 
        status: 400,
        error: result.error 
    });
    }

    res.status(201).json({ 
        status: 201,
        blog_id: result.blog_id,
        message: "Blog created successfully." });

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
        status: 500,
        error: 'Failed to create post.' 
    });
  }
}

// Delete a blog post by ID
export async function deleteBlog(req, res) {
  const { id } = req.params;
  try {
    const result = await blogModel.deleteBlogById(id);

    if (result.error) {
      return res.status(404).json({
        status: 404,
        error: result.error 
    });
    }

    res.status(200).json({ 
        status: 200,
        message: result.message 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
        status: 500,
        error: 'Failed to delete post.' 
    });
  }
}
