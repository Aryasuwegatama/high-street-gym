import { Router } from "express";
import * as ActivityController from "../controllers/activities.js";
import controlAccess from "../middleware/controlAccess.js";

const activityRouter = Router();

activityRouter.get(
  "/trainer-activities/:id",
  controlAccess(["trainer", "admin"]),
  ActivityController.getTrainerActivities
);

activityRouter.delete(
  "/delete-activity/:userId/:activityId",
  controlAccess(["trainer", "admin"]),
  ActivityController.deleteTrainerActivity
);

activityRouter.post(
  "/",
  controlAccess(["admin"]),
  ActivityController.validateActivityData,
  ActivityController.createActivity
);

activityRouter.get(
  "/",
  controlAccess(["trainer", "admin"]),
  ActivityController.getAllActivities
);

activityRouter.get(
  "/activity/:id",
  controlAccess(["trainer", "admin"]),
  ActivityController.getActivityById
);

activityRouter.patch(
  "/update-activity/:id",
  controlAccess(["admin"]),
  ActivityController.validateActivityData,
  ActivityController.updateActivity
);

activityRouter.delete(
  "/delete-activity/:id",
  controlAccess(["admin"]),
  ActivityController.deleteActivityById
);

activityRouter.get(
  "/all-trainer-activities",
  controlAccess(["trainer", "admin"]),
  ActivityController.getAllTrainerActivities
);

activityRouter.post(
  "/assign-trainer",
  controlAccess(["admin"]),
  ActivityController.assignTrainerToActivity
);

export default activityRouter;
