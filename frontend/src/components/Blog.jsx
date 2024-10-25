import React, { useEffect, useState } from "react";
import * as blogAPI from "../api/blogs";
import { userIdTest as user_id } from "../user-session-sample"; 

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ blog_title: "", blog_content: "" });
  const [loading, setLoading] = useState(true);
  const [creatingBlog, setCreatingBlog] = useState(false); 

  useEffect(() => {
    loadUserBlogs();
  }, []);

  // Load user blogs from the API
  async function loadUserBlogs() {
    setLoading(true);
    try {
      const { data } = await blogAPI.fetchBlogsByUser(user_id);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle input change for new blog
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle blog creation
  const handleCreateBlog = async () => {
    setCreatingBlog(true); 
    try {
      const blog = { user_id, ...newBlog };
      await blogAPI.createBlog(blog);
      await loadUserBlogs(); 
      setNewBlog({ blog_title: "", blog_content: "" }); 
      alert("Blog created successfully!");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog.");
    } finally {
      setCreatingBlog(false); // End loading state for blog creation
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async (id) => {
    try {
      await blogAPI.deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog.blog_id !== id));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog.");
    }
  };

  // Helper function to truncate content
  const truncateContent = (content, limit = 30) => {
    if (!content) return "No content available";
    const words = content.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : content;
  };

  // if (loading)
  //   return (
  //     <span className="loading loading-spinner loading-lg text-info"></span>
  //   );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>

      {/* Create Blog Form */}
      <div className="mb-6">
        <input
          type="text"
          name="blog_title"
          value={newBlog.blog_title}
          onChange={handleInputChange}
          placeholder="Blog Title"
          className="input input-bordered mb-2 block w-full"
        />
        <textarea
          name="blog_content"
          value={newBlog.blog_content}
          onChange={handleInputChange}
          placeholder="Write your blog..."
          className="textarea textarea-bordered block w-full"
        ></textarea>
        <button
          onClick={handleCreateBlog}
          className="btn btn-primary mt-2"
          disabled={creatingBlog}
        >
          {creatingBlog ? (
            <span className="loading loading-spinner loading-sm text-info"></span>
          ) : (
            "Create Blog"
          )}
        </button>
      </div>

      {/* Blog List */}
      <div>
        {loading ? (
          <span className="loading loading-spinner loading-lg text-info"></span>
        ) : blogs.length === 0 ? (
          <p>No blogs available.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.blog_id} className="mb-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold">{blog.blog_title}</h3>
              <small>
                Created by: {blog.user_firstname} {blog.user_lastname} on{" "}
                {new Date(blog.blog_created_at).toLocaleString()}
              </small>
              <p className="py-4">{truncateContent(blog.blog_content, 30)}</p>
              <button
                onClick={() => handleDeleteBlog(blog.blog_id)}
                className="btn btn-error btn-sm mt-2 ml-2"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
