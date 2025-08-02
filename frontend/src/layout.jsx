import React from "react";
import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import PageContext from "./context/PageContext";
import BtmNav from "./components/common/BottomNav";
import TopNav from "./components/common/TopNav";
import Footer from "./components/common/Footer";

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
      case "/bookings":
        setCurrentPage("BOOKINGS");
        break;
      case "/clubs":
        setCurrentPage("CLUBS");
        break;
      case "/profile":
        setCurrentPage("PROFILE");
        break;
      case "/blogs":
        setCurrentPage("BLOGS");
        break;
      case "/user/:userId":
        setCurrentPage("USER_DETAILS");
        break;
      default:
        setCurrentPage("HOME");
    }
  }, [location.pathname]); // Update whenever the path changes
  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      <div className="bg-gray-100 min-h-screen md:flex md:flex-col md:justify-between">
        <TopNav currentPage={currentPage} />
        <Outlet />
        <Footer/>
        <BtmNav setCurrentPage={setCurrentPage} />
      </div>
    </PageContext.Provider>
  );
}
