import { Router } from "express";
import { OrderController } from "../controllers/orders.controller.js";
import { uploader } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", OrderController.getAll);
router.get("/:oid", OrderController.getById);
router.post("/", OrderController.create);
router.put("/:oid/status", OrderController.updateStatus);
router.delete("/:oid", OrderController.delete);
router.post("/:oid/proof", uploader.single("proof"), OrderController.uploadProof);

export default router;
