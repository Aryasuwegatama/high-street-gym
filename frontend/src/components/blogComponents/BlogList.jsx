import React, { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import LoadingSpinner from "../common/LoadingSpinner";

export default function BlogList({ blogs, loading, onDelete, onView }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const truncateContent = (content, limit = 30) => {
    if (!content) return "No content available";
    const words = content.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : content;
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(blogToDelete.blog_id);
    setShowConfirmModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setBlogToDelete(null);
  };

  if (loading) {
    return <LoadingSpinner size="lg" color="info" />;
  }

  if (blogs.length === 0) {
    return <p>No blogs available.</p>;
  }

  // Sort blogs by creation date in descending order
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.blog_created_at) - new Date(a.blog_created_at)
  );

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <div
          key={blog.blog_id}
          className="mb-4 p-4 border rounded-md bg-base-100"
        >
          <h3 className="text-lg font-semibold">{blog.blog_title}</h3>
          <small>
            Created by: {blog.user_firstname} {blog.user_lastname} on{" "}
            {new Date(blog.blog_created_at).toLocaleString()}
          </small>
          <p className="py-4">{truncateContent(blog.blog_content, 30)}</p>
          <button
            onClick={() => onView(blog)}
            className="button-main-style text-base-100 mr-1"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteClick(blog)}
            className="button-delete-style"
          >
            Delete
          </button>
        </div>
      ))}
      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this blog?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
