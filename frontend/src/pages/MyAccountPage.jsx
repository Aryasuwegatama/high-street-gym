import { useEffect, useContext } from "react";
import MyAccount from "../components/UserComponents/MyAccount";
import PageContext from "../context/PageContext";

export default function UserAccount() {
  const { setCurrentPage } = useContext(PageContext);

  useEffect(() => {
    setCurrentPage("MY ACCOUNT");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto py-8">
      <MyAccount />
    </div>
  );
}
