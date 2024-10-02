import React from "react";
import { useState, useEffect } from "react";
import MobileClubs from "../components/mobileClub";
import DesktopClubs from "../components/desktopClub";

export default function ClubsContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Add an event listener to update isMobile when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div>{isMobile ? <MobileClubs /> : <DesktopClubs />}</div>;
}
