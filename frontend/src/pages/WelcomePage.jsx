import {
  TbBrandInstagram,
  TbBrandYoutube,
  TbBrandLinkedin,
  TbBrandX,
} from "react-icons/tb";
import logo from "/logo-white.png";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleSignInClick = () => navigate("/signin");
  const handleSignUpClick = () => navigate("/signup");
  const handleBackClick = () => navigate("/"); 

  return (
    <div className="bg-welcome-img bg-cover h-screen bg-right flex flex-col justify-between">
      {/* --- Social Icons and Logo --- */}
      <div className="text-base-300 flex pt-6 justify-between">
        <div className="icon flex">
          <a
            className="px-2 hover:text-primary flex flex-col justify-center"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TbBrandInstagram className="h-7 w-7" />
          </a>
          <a
            className="px-2 hover:text-primary flex flex-col justify-center"
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TbBrandYoutube className="h-7 w-7" />
          </a>
          <a
            className="px-2 hover:text-primary flex flex-col justify-center"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TbBrandLinkedin className="h-7 w-7" />
          </a>
          <a
            className="px-2 hover:text-primary flex flex-col justify-center"
            href="https://www.twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TbBrandX className="h-7 w-7" />
          </a>
        </div>
        <div onClick={handleBackClick} className="logo">
          <img className="w-12 h-10 mx-4" src={logo} alt="Logo" />
        </div>
      </div>

      {/* --- Welcome Message or Forms --- */}
      <div className="bg-gradient-to-t from-black via-black p-7">
        <div className="max-w-md w-full p-8 rounded-lg text-base-100">
          <div>
            <h1 className="text-3xl font-bold mb-4 drop-shadow-2xl">
              Welcome to <br />
              High Street Gym
            </h1>
            <p className="text-base-100-600 mb-4">
              Your premier destination for fitness classes and activities.
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={handleSignInClick}
                className="btn btn-primary hover:bg-secondary px-8 focus:outline focus:bg-secondary focus:shadow-outline text-lg rounded-full"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUpClick}
                className="btn hover:bg-base-300 px-8 focus:outline focus:bg-base-300 focus:shadow-outline text-lg rounded-full"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
