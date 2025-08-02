import { useEffect, useContext } from "react";
import ManageUsers from "../components/UserComponents/ManageUsers";
import PageContext from "../context/PageContext";

export default function ManageUserPage() {
  const { setCurrentPage } = useContext(PageContext);

  useEffect(() => {
    setCurrentPage("All USERS");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto pt-8 pb-20">
      <ManageUsers />
    </div>
  );
}
