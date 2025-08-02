import { useEffect, useContext } from "react";
import PageContext from "../context/PageContext";
import ManageClasses from "../components/classesComponent/manageClasses";

export default function ManageClassesPage() {
  const { setCurrentPage } = useContext(PageContext);

  useEffect(() => {
    setCurrentPage("All CLASSES");
  }, [setCurrentPage]);

  return (
    <div className="container mx-auto pt-8 pb-20">
      <ManageClasses />
    </div>
  );
}
