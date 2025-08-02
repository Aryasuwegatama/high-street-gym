import React, { useEffect, useState } from "react";
import { fetchAllBlogs, deleteBlog } from "../../api/blogs";
import LoadingSpinner from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authenticatedUser } = useAuth();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetchAllBlogs();
        if (response.status === 200 && Array.isArray(response.data)) {
          const sortedBlogs = response.data.sort(
            (a, b) => new Date(b.blog_created_at) - new Date(a.blog_created_at)
          );
          setBlogs(sortedBlogs);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const handleCardClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await deleteBlog(blogId, authenticatedUser.authToken);
      setBlogs(blogs.filter((blog) => blog.blog_id !== blogId));
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" color="info" />;
  }

  const groupedBlogs = blogs.reduce((acc, blog) => {
    const user = `${blog.user_firstname} ${blog.user_lastname}`;
    if (!acc[user]) {
      acc[user] = [];
    }
    acc[user].push(blog);
    return acc;
  }, {});

  return (
    <div className="container mx-auto my-8 px-8 pb-20">
      <h2 className="text-2xl font-bold mb-4 text-center">All Blogs</h2>
      {authenticatedUser && authenticatedUser.user.role === "admin" ? (
        Object.keys(groupedBlogs).map((user) => (
          <div key={user} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">{user}'s Blogs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {groupedBlogs[user].map((blog) => (
                <div key={blog.blog_id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title text-xl font-bold">
                      {blog.blog_title}
                    </h3>
                    <p className="text-sm">
                      By {blog.user_firstname} {blog.user_lastname} on{" "}
                      {new Date(blog.blog_created_at).toLocaleDateString()}
                    </p>
                    <p>{blog.blog_content.substring(0, 100)}...</p>
                    <div className="flex justify-between mt-4">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleCardClick(blog.blog_id)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/edit-blog/${blog.blog_id}`)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteBlog(blog.blog_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <div
              key={blog.blog_id}
              className="card bg-base-100 shadow-xl cursor-pointer"
              onClick={() => handleCardClick(blog.blog_id)}
            >
              <div className="card-body">
                <h3 className="card-title text-xl font-bold">
                  {blog.blog_title}
                </h3>
                <p className="text-sm">
                  By {blog.user_firstname} {blog.user_lastname} on{" "}
                  {new Date(blog.blog_created_at).toLocaleDateString()}
                </p>
                <p>{blog.blog_content.substring(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
