import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import * as blogAPI from "../../api/blogs";
import PageContext from "../../context/PageContext";
import LoadingSpinner from "../common/LoadingSpinner";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentPage } = useContext(PageContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setCurrentPage("VIEW BLOG");
        const response = await blogAPI.fetchBlogById(id);
        console.log(response.data);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, setCurrentPage]);

  if (loading) {
    return <LoadingSpinner size="lg" color="info" />;
  }

  if (!blog) {
    return <p>Blog not found.</p>;
  }

  const formattedDate = new Date(blog.blog_created_at).toLocaleString();

  return (
    <>
      <div className="pt-4 pb-20 px-8">
        <div className="mb-10">
          <p
            onClick={() => navigate(-1)}
            className="text-info text-lg underline inline"
          >
            Back
          </p>
          <p className="text-gray-500 text-lg inline"> &gt; View Blog</p>
        </div>
        <h2 className="text-2xl font-bold mb-4">{blog.blog_title}</h2>
        <small>
          Created by: {blog.user_firstname} {blog.user_lastname} on{" "}
          {formattedDate}
        </small>
        <p className="py-4">{blog.blog_content}</p>
      </div>
    </>
  );
}
