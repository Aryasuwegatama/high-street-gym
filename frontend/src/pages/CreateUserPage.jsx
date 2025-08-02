import { useEffect, useContext } from "react";
import CreateUser from "../components/UserComponents/CreateUser";
import { useNavigate } from "react-router-dom";
import PageContext from "../context/PageContext";

export default function CreateUserPage() {
  const { setCurrentPage } = useContext(PageContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage("CREATE USER");
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
        <p className="text-gray-500 text-lg inline"> &gt; Create User</p>
      </div>
      <CreateUser />
    </div>
  );
}
