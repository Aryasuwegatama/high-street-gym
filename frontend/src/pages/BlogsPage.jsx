import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AllBlogs from "../components/blogComponents/AllBlogs";
import PageContext from "../context/PageContext";

export default function BlogsPage() {
  const { setCurrentPage } = useContext(PageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage("BLOGS");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto pb-8 pt-4">
      <div className="mb-2">
        <p
          onClick={() => navigate("/my-blogs")}
          className="text-info text-lg underline inline"
        >
          My Blogs
        </p>
        <p className="text-gray-500 text-lg inline"> &gt; All Blogs</p>
      </div>

      <AllBlogs />
    </div>
  );
}
