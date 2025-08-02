import { Router } from "express";
import * as xmlImportController from "../controllers/XMLimport.js";
import controlAccess from "../middleware/controlAccess.js";

const XMLRouter = Router();

XMLRouter.post("/activities", controlAccess(['admin']), xmlImportController.uploadActivities);
XMLRouter.post("/clubs", controlAccess(['admin']), xmlImportController.uploadClubs);

export default XMLRouter;
