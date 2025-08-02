import { useState } from "react";

export default function BlogForm({ onCreateBlog, creatingBlog }) {
  const [newBlog, setNewBlog] = useState({ blog_title: "", blog_content: "" });
  const [formErrors, setFormErrors] = useState({
    blog_title: "",
    blog_content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    const errors = { blog_title: "", blog_content: "" };

    if (!newBlog.blog_title.trim()) {
      errors.blog_title = "Blog title is required";
      valid = false;
    }

    if (!newBlog.blog_content.trim()) {
      errors.blog_content = "Blog content is required";
      valid = false;
    } else if (newBlog.blog_content.trim().length < 10) {
      errors.blog_content = "Blog content must be at least 10 characters long";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateBlog(newBlog);
      setNewBlog({ blog_title: "", blog_content: "" });
    }
  };

  return (
    <div className="mb-6">
      <div className="form-control w-full">
        <input
          type="text"
          name="blog_title"
          value={newBlog.blog_title}
          onChange={handleInputChange}
          placeholder="Blog Title"
          className={`input input-bordered mb-2 block w-full ${
            formErrors.blog_title ? "input-error" : ""
          }`}
        />
        {formErrors.blog_title && (
          <label className="label">
            <span className="label-text-alt text-error">
              {formErrors.blog_title}
            </span>
          </label>
        )}
      </div>

      <div className="form-control w-full">
        <textarea
          name="blog_content"
          value={newBlog.blog_content}
          onChange={handleInputChange}
          placeholder="Write your blog..."
          className={`textarea textarea-bordered block w-full ${
            formErrors.blog_content ? "textarea-error" : ""
          }`}
        />
        {formErrors.blog_content && (
          <label className="label">
            <span className="label-text-alt text-error">
              {formErrors.blog_content}
            </span>
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
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
  );
}
