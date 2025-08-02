import * as bookingsController from "../controllers/bookings.js";
import { Router } from "express";
import controlAccess from "../middleware/controlAccess.js";

const bookingRouter = Router();
// get all bookings (accessible by admins)
bookingRouter.get(
  "/",
  controlAccess(["admin", "trainer"]),
  bookingsController.getAllBookings
);
// get user's booked classes (accessible by all authenticated users)
bookingRouter.get(
  "/user/:userId",
  controlAccess(["member", "trainer", "admin"]),
  bookingsController.getUserBookings
);
// update booking trainer (accessible by trainers and admins)
bookingRouter.patch(
  "/trainer",
  controlAccess(["trainer", "admin"]),
  bookingsController.updateBooking
);
// book a class (accessible by all authenticated users)
bookingRouter.post(
  "/booking",
  controlAccess(["member", "trainer", "admin"]),
  bookingsController.bookClass
);
// cancel booking (accessible by all authenticated users)
bookingRouter.post(
  "/cancel",
  controlAccess(["member", "trainer", "admin"]),
  bookingsController.cancelBooking
);
// delete a booking (accessible by trainers and admins)
bookingRouter.delete(
  "/booking/:bookingId",
  controlAccess(["trainer", "admin"]),
  bookingsController.deleteClassBooking
);
// delete all bookings of a user (accessible by admins)
bookingRouter.delete(
  "/user-bookings/:userId",
  controlAccess(["admin"]),
  bookingsController.deleteAllUserBookings
);

export default bookingRouter;
