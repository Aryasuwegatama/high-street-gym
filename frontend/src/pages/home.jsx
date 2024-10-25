import React from "react";
import Footer from "../components/Footer";
import Blog from "../components/Blog";
import Banner from "../components/Banner";


export default function HomePage() {
  return (
    <>
    <Blog/>
    <div className="pb-20 md:pb-0">
    <Banner/>
    </div>
    <Footer/>
    </>
  );
}
