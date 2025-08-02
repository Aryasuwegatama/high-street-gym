import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogById, updateBlog } from "../../api/blogs";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import BlogModal from "./BlogModal";

export default function EditBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState(null);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();
  const { authToken } = useAuth();

  useEffect(() => {
    const getBlog = async () => {
      console.log("Fetching blog with ID:", id);
      try {
        const response = await fetchBlogById(id);
        console.log("API response:", response);
        if (response.data.blog_id) {
          setBlog(response.data);
        } else {
          throw new Error("Blog not found");
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
        setModalMessage("Blog not found.");
        setModalType("error");
      } finally {
        setLoading(false);
      }
    };
    getBlog();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  console.log("Blog data:", blog);

  const handleUpdateBlog = async () => {
    try {
      await updateBlog(id, blog, authToken);
      setModalMessage("Blog updated successfully.");
      setModalType("success");
    } catch (error) {
      console.error("Failed to update blog", error);
      setModalMessage("Failed to update blog.");
      setModalType("error");
    }
  };

  const handleCloseModal = () => {
    setModalMessage(null);
    setModalType(null);
    navigate("/manage-blogs");
  };

  if (loading) {
    return <LoadingSpinner size="lg" color="info" />;
  }

  return (
    <div className="container mx-auto my-8 px-8 pb-20">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Blog</h2>
      {blog ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="blog_title"
                value={blog.blog_title || ""}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea
                name="blog_content"
                value={blog.blog_content || ""}
                onChange={handleInputChange}
                className="textarea textarea-bordered"
              />
            </div>
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={handleUpdateBlog}>
                Update Blog
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-error">Blog not found.</p>
      )}
      {modalMessage && (
        <BlogModal
          type={modalType}
          message={modalMessage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
