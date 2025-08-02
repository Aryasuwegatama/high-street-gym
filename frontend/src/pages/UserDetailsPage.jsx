import { useEffect, useContext } from "react";
import UserDetails from "../components/UserComponents/UserDetails";
import { useNavigate } from "react-router-dom";
import PageContext from "../context/PageContext";

export default function UserDetailsPage() {
  const { setCurrentPage } = useContext(PageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage("USER DETAILS");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto pb-8 pt-4">
      <div className="mb-4">
        <p
          onClick={() => navigate(-1)}
          className="text-info text-lg underline inline"
        >
          Manage Users
        </p>
        <p className="text-gray-500 text-lg inline"> &gt; User Details</p>
      </div>
      <UserDetails />
    </div>
  );
}
