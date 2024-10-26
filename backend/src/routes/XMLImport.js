import { Router } from "express"
import multer from "multer";
import * as xmlImportController from "../controllers/XMLimport.js"

const XMLRouter = Router();
// const upload = multer({ storage: multer.memoryStorage() });
XMLRouter.post("/activities", xmlImportController.uploadActivities);
// XMLRouter.post("/activities", upload.single("xml-file"), xmlImportController.uploadActivities)

export default XMLRouter;