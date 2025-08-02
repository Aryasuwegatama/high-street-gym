import { useEffect, useContext } from "react";
import PageContext from "../context/PageContext";
import ManageClubs from "../components/clubsComponents/ManageClubs";

export default function ManageClubsPage() {
  const { setCurrentPage } = useContext(PageContext);

  useEffect(() => {
    setCurrentPage("All CLUBS");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto pt-8 pb-20">
      <ManageClubs />
    </div>
  );
}
