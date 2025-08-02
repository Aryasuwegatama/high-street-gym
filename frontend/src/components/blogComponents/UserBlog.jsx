import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as blogAPI from "../../api/blogs";
import { useAuth } from "../../context/AuthContext";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";
import BlogModal from "./BlogModal";
import Footer from "../common/Footer";

export default function Blog() {
  const { authenticatedUser } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingBlog, setCreatingBlog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticatedUser) {
      loadUserBlogs();
    }
  }, [authenticatedUser]);

  const loadUserBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await blogAPI.fetchBlogsByUser(
        authenticatedUser.user.user_id
      );
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (blogData) => {
    setCreatingBlog(true);
    try {
      const blog = { user_id: authenticatedUser.user.user_id, ...blogData };
      await blogAPI.createBlog(blog, localStorage.getItem("authToken"));
      setModalMessage("Blog created successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage("Failed to create blog.");
      setShowErrorModal(true);
    } finally {
      setCreatingBlog(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await blogAPI.deleteBlog(id, localStorage.getItem("authToken"));
      setModalMessage("Blog deleted successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      setModalMessage("Failed to delete blog.");
      setShowErrorModal(true);
    }
  };

  const handleSuccessModalClose = async () => {
    setShowSuccessModal(false);
    await loadUserBlogs();
  };

  const handleViewBlog = (blog) => {
    navigate(`/blogs/${blog.blog_id}`);
  };

  return (
    <>
      <div className="p-8">
        {!authenticatedUser ? (
          <p>Please log in to view and create blogs.</p>
        ) : (
          <>
            {showSuccessModal && (
              <BlogModal
                type="success"
                message={modalMessage}
                onClose={handleSuccessModalClose}
              />
            )}
            {showErrorModal && (
              <BlogModal
                type="error"
                message={modalMessage}
                onClose={() => setShowErrorModal(false)}
              />
            )}

            {/* Create blog component */}
            <h2 className="text-2xl font-bold mb-4">Post a Blog</h2>
            <BlogForm
              onCreateBlog={handleCreateBlog}
              creatingBlog={creatingBlog}
            />
            <hr />
            <br />

            <h2 className="text-2xl font-bold mb-4">My Blogs</h2>
            <BlogList
              blogs={blogs}
              loading={loading}
              onDelete={handleDeleteBlog}
              onView={handleViewBlog}
            />
          </>
        )}
      </div>
    </>
  );
}
