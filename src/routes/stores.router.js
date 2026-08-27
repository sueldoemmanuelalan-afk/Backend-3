import { Router } from "express";
import { StoreController } from "../controllers/stores.controller.js";

const router = Router();

router.get("/", StoreController.getAll);
router.get("/:sid", StoreController.getById);
router.post("/", StoreController.create);
router.put("/:sid", StoreController.update);
router.delete("/:sid", StoreController.delete);

export default router;
