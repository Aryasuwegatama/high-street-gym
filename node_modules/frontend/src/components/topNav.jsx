import { TbUserCircle } from "react-icons/tb";
import { Link } from "react-router-dom";
import logo from "/logo-white.png";
import { useContext } from "react";
import PageContext from "../context/PageContext";

export default function TopNav() {
  const { currentPage } = useContext(PageContext);

  return (
    <div className="navbar sticky top-0 bg-neutral md:px-10 z-50">
      <div className="navbar-start">
        <img className="w-12 mx-4 md:w-14 md:mx-4" src={logo} alt="" />
      </div>
      <div className="navbar-center">
        {/* nav menu in larger view */}
        <div className="hidden md:flex items-center justify-between gap-8 lg:gap-14">
          <Link
            to="/home"
            className={`text-base-100 hover:text-gray-300 ${
              currentPage === "HOME" ? "text-info" : ""
            }`}
          >
            HOME
          </Link>
          <Link
            to="/timetable"
            className={`text-base-100 hover:text-gray-300 ${
              currentPage === "TIMETABLE" ? "text-info" : ""
            }`}
          >
            TIMETABLE
          </Link>
          <Link
            to="/booking"
            className={`text-base-100 hover:text-gray-300 ${
              currentPage === "BOOKING" ? "text-info" : ""
            }`}
          >
            BOOKING
          </Link>
          <Link
            to="/clubs"
            className={`text-base-100 hover:text-gray-300 ${
              currentPage === "CLUBS" ? "text-info" : ""
            }`}
          >
            CLUBS
          </Link>
        </div>
        {/* Nav header in mobile view */}
        <h1 className="text-xl text-base-100 font-semibold md:hidden">
          {currentPage}
        </h1>
      </div>
      <div className="navbar-end">
        <div className="form-control">
          <span className="text-base-100 hidden xs:flex">Hi, Arya</span>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <TbUserCircle className="text-base-100 h-8 w-8" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
            <span className="xs:hidden">
            <TbUserCircle className="text-black h-4" />
            Hi, Arya</span>
            </li>
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
