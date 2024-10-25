import { db } from '../database.js'; // Database connection

// Get all blog posts
export async function getAllBlogs() {
  try {
    const result = await db.query(
      `SELECT 
         blog_posts.blog_id, 
         blog_posts.blog_created_at, 
         blog_posts.blog_user_id, 
         blog_posts.blog_title, 
         blog_posts.blog_content, 
         users.user_firstname, 
         users.user_lastname 
       FROM blog_posts 
       JOIN users ON blog_posts.blog_user_id = users.user_id 
       ORDER BY blog_posts.blog_created_at DESC`
    );
    return result[0];
  } catch (err) {
    return { error: "Failed to fetch posts: " + err.message };
  }
}

// Get a single blog post by ID
export async function getBlogById(blog_id) {
    try {
      const result = await db.query(
        `SELECT 
         blog_posts.blog_id, 
         blog_posts.blog_created_at, 
         blog_posts.blog_user_id, 
         blog_posts.blog_title, 
         blog_posts.blog_content, 
         users.user_firstname, 
         users.user_lastname
       FROM blog_posts 
       JOIN users ON blog_posts.blog_user_id = users.user_id 
       WHERE blog_posts.blog_id = ?`,
        [blog_id]
      );
  
      return result[0];
    } catch (err) {
      return { error: 'Failed to fetch the post: ' + err.message };
    }
  }

// Get all blogs by user ID
export async function getBlogsByUserId(user_id) {
    try {
      const result = await db.query(
        `SELECT 
           blog_posts.blog_id, 
           blog_posts.blog_created_at, 
           blog_posts.blog_user_id, 
           blog_posts.blog_title, 
           blog_posts.blog_content, 
           users.user_firstname, 
           users.user_lastname
         FROM blog_posts 
         JOIN users ON blog_posts.blog_user_id = users.user_id 
         WHERE blog_posts.blog_user_id = ?`,
        [user_id]
      );
      return result[0];
    } catch (err) {
      return { error: "Failed to fetch blogs: " + err.message };
    }
  }

// Create a new blog post
export async function createBlog(user_id, blog_title, blog_content) {
  try {
    const [result] = await db.query(
      `INSERT INTO blog_posts (blog_user_id, blog_title, blog_content, blog_created_at) 
       VALUES (?, ?, ?, NOW())`,
      [user_id, blog_title, blog_content]
    );

    return { success: true, blog_id: result.insertId };
  } catch (err) {
    return { error: "Failed to create post: " + err.message };
  }
}

// Delete a blog post by ID
export async function deleteBlogById(blog_id) {
  try {
    const [result] = await db.query('DELETE FROM blog_posts WHERE blog_id = ?', [blog_id]);

    if (result.affectedRows === 0) {
      return { error: "Post not found." };
    }

    return { success: true, message: "Post deleted successfully." };
  } catch (err) {
    return { error: "Failed to delete post: " + err.message };
  }
}
