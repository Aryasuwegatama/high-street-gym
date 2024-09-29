import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./pages/auth";
import HomePage from "./pages/home";
import DesktopTimetable from "./components/desktopTimetable";
import Layout from "./layout";
import Booking from "./pages/booking";
import Clubs from "./pages/clubs";
import MobileTimetable from "./components/mobileTimetable";
import TimetableContainer from "./pages/timetable";

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
                // element: <DesktopTimetable />,
                element: <TimetableContainer/>,
            },
            {
                path: "booking",
                element: <Booking />,
            },
            {
                path: "clubs",
                element: <Clubs />,
            },
        ]
    },
    

])

export default router;