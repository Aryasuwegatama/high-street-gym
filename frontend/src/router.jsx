import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import Layout from "./layout";
import Booking from "./pages/BookingsPage";
import TimetableContainer from "./pages/TimetableContainerPage";
import ClubsContainer from "./pages/ClubPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import MyAccountPage from "./pages/MyAccountPage";
import BlogDetail from "./components/blogComponents/BlogDetail";
import BlogCarousel from "./components/blogComponents/BlogCarousel";
import EditClass from "./components/timetableComponents/EditClass";
import ManageUserPage from "./pages/ManageUserPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import BlogsPage from "./pages/BlogsPage";
import MyBlogsPage from "./pages/MyBlogsPage";
import CreateUserPage from "./pages/CreateUserPage";
import AccessForbidden from "./components/common/AccessForbidden";
import { useAuth } from "./context/AuthContext";
import ManageActivitiesPage from "./pages/ManageActivitiesPage";
import ManageClubsPage from "./pages/ManageClubsPage";
import ManageBlogs from "./components/blogComponents/ManageBlogs";
import EditBlog from "./components/blogComponents/EditBlog";
import ManageClassesPage from "./pages/ManageClassesPage";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { authenticatedUser } = useAuth();
  if (
    !authenticatedUser ||
    !allowedRoles.includes(authenticatedUser.user.user_role)
  ) {
    return <AccessForbidden />;
  }
  return element;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "timetable",
        element: <TimetableContainer />,
      },
      {
        path: "bookings",
        element: <Booking />,
      },
      {
        path: "clubs",
        element: <ClubsContainer />,
      },
      {
        path: "profile",
        element: <MyAccountPage />,
      },
      {
        path: "my-blogs",
        element: <MyBlogsPage />,
      },
      {
        path: "blogs/:id",
        element: <BlogDetail />,
      },
      {
        path: "blog-carousel",
        element: <BlogCarousel />,
      },
      {
        path: "all-blogs",
        element: <BlogsPage />,
      },
      {
        path: "edit-blog/:id",
        element: <EditBlog />,
      },
      {
        path: "edit-class/:classId",
        element: (
          <ProtectedRoute element={<EditClass />} allowedRoles={["admin"]} />
        ),
      },
      {
        path: "manage-users",
        element: (
          <ProtectedRoute
            element={<ManageUserPage />}
            allowedRoles={["admin"]}
          />
        ),
      },
      {
        path: "create-user",
        element: (
          <ProtectedRoute
            element={<CreateUserPage />}
            allowedRoles={["admin"]}
          />
        ),
      },
      {
        path: "user/:userId",
        element: (
          <ProtectedRoute
            element={<UserDetailsPage />}
            allowedRoles={["admin"]}
          />
        ),
      },
      {
        path: "manage-activities",
        element: (
          <ProtectedRoute
            element={<ManageActivitiesPage />}
            allowedRoles={["admin"]}
          />
        ),
      },
      {
        path: "manage-clubs",
        element: (
          <ProtectedRoute
            element={<ManageClubsPage />}
            allowedRoles={["admin"]}
          />
        ),
      },
      {
        path: "manage-blogs",
        element: (
          <ProtectedRoute element={<ManageBlogs />} allowedRoles={["admin"]} />
        ),
      },
      {
        path: "manage-classes",
        element: (
          <ProtectedRoute
            element={<ManageClassesPage />}
            allowedRoles={["admin"]}
          />
        ),
      },
    ],
  },
]);

export default router;
