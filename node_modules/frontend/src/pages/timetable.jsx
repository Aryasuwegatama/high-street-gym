import React from "react";
import { useState, useEffect } from "react";
import DesktopTimetable from "../components/timetableComponents/desktopTimetable";
import MobileTimetable from "../components/timetableComponents/mobileTimetable";

export default function TimetableContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Add an event listener to update isMobile when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div>{isMobile ? <MobileTimetable /> : <DesktopTimetable />}</div>;
}
