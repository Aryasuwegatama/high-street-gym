import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MyBlog from "../components/blogComponents/UserBlog";
import PageContext from "../context/PageContext";

export default function MyBlogsPage() {
  const { setCurrentPage } = useContext(PageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage("MY BLOGS");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto pb-8 pt-4">
      <div className="mb-2">
        <p
          onClick={() => navigate("/all-blogs")}
          className="text-info text-lg underline inline"
        >
          All Blogs
        </p>
        <p className="text-gray-500 text-lg inline"> &gt; My Blogs</p>
      </div>

      <MyBlog />
    </div>
  );
}
