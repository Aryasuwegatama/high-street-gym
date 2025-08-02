import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Banner from "../components/common/Banner";
import BlogCarousel from "../components/blogComponents/BlogCarousel";

export default function HomePage() {
  const navigate = useNavigate();

  const handleViewMyBlog = () => {
    navigate("/my-blogs");
  };

  const handleViewAllBlogs = () => {
    navigate("/all-blogs");
  };

  return (
    <>
      <div className="my-8">
        <BlogCarousel />
      </div>
      <div className="flex justify-center my-4">
        <button
          className="button-main-style text-base-100"
          onClick={handleViewMyBlog}
        >
          View My Blog
        </button>
        <button
          className="button-main-style text-base-100 ml-4"
          onClick={handleViewAllBlogs}
        >
          View All Blogs
        </button>
      </div>
      <div className="pb-20 md:pb-0">
        <Banner />
      </div>
    </>
  );
}
