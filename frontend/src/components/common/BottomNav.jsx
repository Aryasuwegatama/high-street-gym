import { Link } from "react-router-dom";
import { useContext } from "react";
import PageContext from "../../context/PageContext";
import {
  TbFileTypeXml,
  TbHome,
  TbCalendarSearch,
  TbBook2,
} from "react-icons/tb";
import { FaMapLocationDot } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import { BiSolidMessageEdit } from "react-icons/bi";

export default function BtmNav({ setCurrentPage }) {
  const { currentPage } = useContext(PageContext);
  return (
    <nav className="md:hidden btm-nav btm-nav-sm bg-neutral rounded-full flex items-center justify-center py-8 z-50">
      {/* icon using tabler library */}
      <Link
        to={"/home"}
        onClick={() => setCurrentPage("HOME")}
        className="h-12 text-base-100 text-xs bg-transparent border-none"
      >
        <TbHome
          className={`h-7 text-base-100 ${
            currentPage === "HOME" ? "text-info" : ""
          }`}
          size="lg"
        />
        home
      </Link>
      <Link
        to={"/timetable"}
        onClick={() => setCurrentPage("TIMETABLE")}
        className="h-12 text-base-100 text-xs bg-transparent border-none"
      >
        <TbCalendarSearch
          className={`h-7 text-base-100 ${
            currentPage === "TIMETABLE" ? "text-info" : ""
          }`}
          size="lg"
        />
        timetable
      </Link>
      <Link
        to={"/bookings"}
        onClick={() => setCurrentPage("BOOKINGS")}
        className="h-12 text-base-100 text-xs bg-transparent border-none"
      >
        <TbBook2
          className={`h-7 text-base-100 ${
            currentPage === "BOOKINGS" ? "text-info" : ""
          }`}
          size="lg"
        />
        bookings
      </Link>
      <Link
        to={"/clubs"}
        onClick={() => setCurrentPage("CLUBS")}
        className="h-12 text-base-100 text-xs bg-transparent border-none"
      >
        <GrMapLocation
          className={`h-7 text-base-100 ${
            currentPage === "CLUBS" ? "text-info" : ""
          }`}
          size="lg"
        />
        clubs
      </Link>
      {/* <Link
        to={"/home"}
        onClick={() => setCurrentPage("home")}
        className="h-16 text-base-100 text-xs bg-transparent border-none"
      >
        <BiSolidMessageEdit className="h-7 text-base-100" size="lg" />
        blogpost
      </Link> */}
    </nav>
  );
}
