import * as classController from "../controllers/classes.js";
import { Router } from "express";
import controlAccess from "../middleware/controlAccess.js";

const classRouter = Router();
// get all classes (accessible by all authenticated users)
classRouter.get(
  "/",
  controlAccess(["member", "trainer", "admin"]),
  classController.getAllClasses
);
// get class by club (accessible by all authenticated users)
classRouter.get(
  "/club/:clubName",
  controlAccess(["member", "trainer", "admin"]),
  classController.getClassesByClub
);
// get trainer availability (accessible by all authenticated users)
classRouter.get(
  "/trainer-availability",
  controlAccess(["member", "trainer", "admin"]),
  classController.getTrainerAvailability
);
// create class (accessible by admins)
classRouter.post("/", controlAccess(["admin"]), classController.createClass);
// update class data (accessible by admins)
classRouter.patch(
  "/:id",
  controlAccess(["admin"]),
  classController.updateClass
); 
// delete class (accessible by admins)
classRouter.delete(
  "/:id",
  controlAccess(["admin"]),
  classController.deleteClass
);
// check if any user booked the class (accessible by admins)
classRouter.get(
  "/:id/bookings",
  controlAccess(["admin"]),
  classController.checkClassBookings
);
// delete bookings for a specific class (accessible by admins)
classRouter.delete(
  "/:id/bookings",
  controlAccess(["admin"]),
  classController.deleteClassBookings
);

export default classRouter;
