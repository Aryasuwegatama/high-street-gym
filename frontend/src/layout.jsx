import React from "react";
import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import PageContext from "./context/PageContext";
import BtmNav from "./components/bottomNav";
import TopNav from "./components/topNav";

export default function Layout() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("HOME");

  // Update currentPage based on the route
  React.useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/timetable":
        setCurrentPage("TIMETABLE");
        break;
      case "/booking":
        setCurrentPage("BOOKING");
        break;
      case "/clubs":
        setCurrentPage("CLUBS");
        break;
      default:
        setCurrentPage("HOME");
    }
  }, [location.pathname]); // Update whenever the path changes
  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      <div className="bg-gray-100 min-h-screen justify-between">
        <TopNav currentPage={currentPage} />
        <Outlet />
        <BtmNav setCurrentPage={setCurrentPage} />
      </div>
    </PageContext.Provider>
  );
}
