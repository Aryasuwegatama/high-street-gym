import {
  TbBrandInstagram,
  TbBrandYoutube,
  TbBrandLinkedin,
  TbBrandX,
} from "react-icons/tb";
import logo from "/logo-white.png";
import SignIn from "../components/signinForm";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();

  const changeToSignUp = () => navigate("/signup");
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

      {/* ---  Form --- */}
      <div className="bg-gradient-to-t from-black via-black p-7">
        <div className="max-w-md w-full p-8 rounded-lg text-base-100">
          <SignIn changeToSignUp={changeToSignUp} />
        </div>
      </div>
    </div>
  );
}
