import React, { useEffect, useState } from "react";
import { fetchAllBlogs } from "../../api/blogs";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const BlogCarousel = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetchAllBlogs();
        console.log("Fetched blogs data:", response);
        if (response.status === 200 && Array.isArray(response.data)) {
          // Sort blogs by creation date in descending order
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

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blogs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCardClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  if (loading) {
    return <LoadingSpinner size="lg" color="info" />;
  }

  const getVisibleBlogs = () => {
    const visibleBlogs = [];
    // Show 1 card on mobile, 3 on larger screens
    const numVisibleBlogs = window.innerWidth < 640 ? 1 : 3;
    for (let i = 0; i < numVisibleBlogs; i++) {
      visibleBlogs.push(blogs[(currentIndex + i) % blogs.length]);
    }
    return visibleBlogs;
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">BLOGS</h2>
      <div className="carousel w-full flex justify-center relative">
        {Array.isArray(blogs) && blogs.length > 0 ? (
          <div className="flex">
            {getVisibleBlogs().map((blog) => (
              <div
                className="carousel-item cursor-pointer"
                key={blog.blog_id}
                onClick={() => handleCardClick(blog.blog_id)}
              >
                <div
                  className="card bg-base-100 shadow-xl m-4"
                  style={{ height: "300px", width: "300px" }}
                >
                  <div className="card-body flex flex-col justify-between">
                    <div>
                      <h3 className="card-title text-xl font-bold">
                        {blog.blog_title}
                      </h3>
                      <p className="text-sm">
                        By {blog.user_firstname} {blog.user_lastname} on{" "}
                        {new Date(blog.blog_created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="flex-grow">
                      {blog.blog_content.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No blogs available</p>
        )}
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <button onClick={handlePrev} className="btn btn-circle">
            ❮
          </button>
          <button onClick={handleNext} className="btn btn-circle">
            ❯
          </button>
        </div>
      </div>
    </>
  );
};

export default BlogCarousel;
