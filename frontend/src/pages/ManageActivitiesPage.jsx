import { useEffect, useContext } from "react";
import PageContext from "../context/PageContext";
import ManageActivities from "../components/ActivitiesComponent/ManageActivities";

export default function ManageActivitiesPage() {
  const { setCurrentPage } = useContext(PageContext);

  useEffect(() => {
    setCurrentPage("All ACTIVITIES");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto pt-8 pb-20">
      <ManageActivities />
    </div>
  );
}
