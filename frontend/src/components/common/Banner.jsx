import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bannerImg from "/banner-image.jpg";


export default function Banner() {
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
    return (
      <section className="flex justify-between w- full bg-cover bg-right">
        <div className="hidden sm:relative sm:flex-1 sm:flex">
          <img src={bannerImg} alt="" 
          className="absolute h-full w-full object-cover " />
        </div>
        {isMobile ? 
        <div className="bg-banner-img bg-cover flex flex-col flex-1 py-14 px-8 gap-8">
        <h2 className="text-3xl font-bold text-base-100">FIND MORE CLASSES</h2>
      <p className="text-base-100">Explore our full timetable and book your next workout.</p>
  
        <div>
      <Link
      to={"/timetable"}
      className="button-main-style text-sm text-base-100"
      >
      View Timetable
      </Link>
  
        </div>
      </div> 
        : 
        <div className="flex flex-col flex-1 py-14 px-8 gap-8 bg-neutral">
          <h2 className="text-3xl font-bold text-base-100">FIND MORE CLASSES</h2>
        <p className="text-base-100">Explore our full timetable and book your next workout.</p>
  
          <div>
        <Link
        to={"/timetable"}
        className="button-main-style text-sm "
        >
        View Timetable
        </Link>
  
          </div>
        </div> 
        }
        
      </section>
    );
  };