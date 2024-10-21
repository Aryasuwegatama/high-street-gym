import * as classController from "../controllers/classes.js"
import * as bookingsController from "../controllers/bookings.js"
import { Router } from "express"

const classRouter = Router()
// get all classes
classRouter.get("/", classController.getAllClasses)
// get class by club
classRouter.get("/club/:clubName", classController.getClassesByClub)
// get trainer availability
classRouter.get("/trainer-availability", classController.getTrainerAvailability)
// book class
classRouter.post("/booking", classController.bookClass)
// get bookings
// Route to get user's booked classes
classRouter.get('/bookings/user/:userId', bookingsController.getUserBookings);
// Route to get user's booked classes
classRouter.get('/bookings/user/:userId', bookingsController.getUserBookings);
// Cancel booking
classRouter.post('/cancel', bookingsController.cancelBooking);
// delete a booking 
classRouter.delete("/booking/:bookingId", bookingsController.deleteClassBooking);




export default classRouter;