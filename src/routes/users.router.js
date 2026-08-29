import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { uploader } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", UserController.getAll);
router.get("/:uid", UserController.getById);
router.post("/", UserController.create);
router.put("/:uid", UserController.update);
router.delete("/:uid", UserController.delete);
router.post("/:uid/documents", uploader.single("document"), UserController.uploadDocuments);

export default router;
