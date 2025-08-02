import { TbUserCircle } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo-white.png";
import { useContext, useEffect } from "react";
import PageContext from "../../context/PageContext";
import { useAuth } from "../../context/AuthContext";

export default function TopNav() {
  const { currentPage } = useContext(PageContext);
  const { authenticatedUser, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Rendering TopNav, authenticatedUser:", authenticatedUser);
  }, [authenticatedUser]);

  const handleSignOut = () => {
    console.log("User is logging out");
    signOut();
    navigate("/");
  };

  const handleMyAccount = () => {
    navigate("/profile");
  };

  const handleMyBlog = () => {
    navigate("/my-blogs");
  };

  const handleManageBlogs = () => {
    navigate("/manage-blogs");
  };
  const handleManageActivities = () => {
    navigate("/manage-activities");
  };
  const handleManageClubs = () => {
    navigate("/manage-clubs");
  };

  const handleManageUsers = () => {
    navigate("/manage-users");
  };
  const handleManageClasses = () => {
    navigate("/manage-classes");
  };

  return (
    <div className="navbar sticky top-0 bg-neutral md:px-10 z-50 relative border-b border-white">
      <div className="navbar-start">
        <img className="w-12 mx-4 md:w-14 md:mx-4" src={logo} alt="logo hsg" />
      </div>

      <div className="navbar-center">
        <div className="hidden md:flex items-center justify-between gap-8 lg:gap-14">
          <Link
            to="/home"
            className={`text-base-100 ${currentPage === "HOME" ? "text-info" : ""}`}
          >
            HOME
          </Link>
          <Link
            to="/timetable"
            className={`text-base-100 ${currentPage === "TIMETABLE" ? "text-info" : ""}`}
          >
            TIMETABLE
          </Link>
          <Link
            to="/bookings"
            className={`text-base-100 ${currentPage === "BOOKINGS" ? "text-info" : ""}`}
          >
            BOOKINGS
          </Link>
          <Link
            to="/clubs"
            className={`text-base-100 ${currentPage === "CLUBS" ? "text-info" : ""}`}
          >
            CLUBS
          </Link>
        </div>
        <h1 className="text-xl text-base-100 font-semibold md:hidden">
          {currentPage}
        </h1>
      </div>

      <div className="navbar-end">
        <div className="form-control">
          <div className="text-base-100 hidden xs:flex xs:flex-col text-xs text-right">
            <span>Howdy, </span>
            <span>
              {authenticatedUser
                ? authenticatedUser.user.user_firstname
                : "Guest"}
            </span>
          </div>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <TbUserCircle className="text-base-100 h-8 w-8" />
          </div>
          {authenticatedUser ? (
            <ul className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li className="text-right py- text-lg xs:hidden">
                Hi,{" "}
                {authenticatedUser
                  ? authenticatedUser.user.user_firstname
                  : "Guest"}
                <hr className="my-2 xs:hidden" />
              </li>
              {authenticatedUser.user.user_role === "admin" ? (
                <>
                  <li>
                    <button onClick={handleManageBlogs}>Manage Blogs</button>
                  </li>
                  <li>
                    <button onClick={handleManageUsers}>Manage Users</button>
                  </li>
                  <li>
                    <button onClick={handleManageActivities}>
                      Manage Activities
                    </button>
                  </li>
                  <li>
                    <button onClick={handleManageClasses}>
                      Manage Classes
                    </button>
                  </li>
                  <li>
                    <button onClick={handleManageClubs}>Manage Clubs</button>
                  </li>
                  <li>
                    <button onClick={handleMyBlog}>My Blogs</button>
                  </li>
                  <li>
                    <button onClick={handleMyAccount}>My Account</button>
                  </li>
                  <li>
                    <button className="text-error" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button onClick={handleMyBlog}>My Blogs</button>
                  </li>
                  <li>
                    <button onClick={handleMyAccount}>My Account</button>
                  </li>
                  <li>
                    <button className="text-error" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </li>
                </>
              )}
            </ul>
          ) : (
            <ul className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
