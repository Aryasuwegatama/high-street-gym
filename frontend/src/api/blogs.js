import { API_URL } from './api'; // Adjust if you have a different API URL

// Fetch all blogs
export async function fetchAllBlogs() {
  const response = await fetch(`${API_URL}/blogs`);
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return await response.json();
}

// Fetch a single blog by ID
export async function fetchBlogById(id) {
  const response = await fetch(`${API_URL}/blogs/${id}`);
  if (!response.ok) throw new Error('Blog not found');
  return await response.json();
}

// Fetch blogs by user ID
export async function fetchBlogsByUser(user_id) {
    const response = await fetch(`${API_URL}/blogs/user-blog/${user_id}`);
    console.log(response)
    if (!response.ok) throw new Error('Failed to fetch user blogs');
    return await response.json();
  }

// Create a new blog post
export async function createBlog(blog) {
  const response = await fetch(`${API_URL}/blogs/post-blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blog),
  });
  if (!response.ok) throw new Error('Failed to create blog');
  return await response.json();
}

// Delete a blog post by ID
export async function deleteBlog(id) {
  const response = await fetch(`${API_URL}/blogs/delete-blog/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete blog');
  return await response.json();
}
