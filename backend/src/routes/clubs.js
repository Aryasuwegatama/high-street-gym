import { Router } from "express";
import * as ClubController from "../controllers/clubs.js";
import controlAccess from "../middleware/controlAccess.js";

const clubRouter = Router();

// Create a new club
clubRouter.post("/", controlAccess(["admin"]), ClubController.createClub);

// Get all clubs
clubRouter.get(
  "/",
  controlAccess(["member", "trainer", "admin"]),
  ClubController.getAllClubs
);

// Get a single club by ID
clubRouter.get(
  "/:id",
  controlAccess(["member", "trainer", "admin"]),
  ClubController.getClubById
);

// Update a club by ID
clubRouter.patch("/:id", controlAccess(["admin"]), ClubController.updateClub);

// Delete a club by ID
clubRouter.delete("/:id", controlAccess(["admin"]), ClubController.deleteClub);

export default clubRouter;
