import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./pages/auth";
import HomePage from "./pages/home";
import Layout from "./layout";
import Booking from "./pages/booking";
import TimetableContainer from "./pages/timetable";
import ClubsContainer from "./pages/clubs";
import Blog from "./components/Blog";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage />,
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
                element: <TimetableContainer/>,
            },
            {
                path: "booking",
                element: <Booking />,
            },
            {
                path: "clubs",
                element: <ClubsContainer />,
            },
        ]
    },
    {
        path: "/blogs",
        element: <Blog/>
    },
    

])

export default router;