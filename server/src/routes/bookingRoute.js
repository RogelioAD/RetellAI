import { Router } from "express";
import { submitBooking } from "../controllers/bookingController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.post("/submit-booking", asyncHandler(submitBooking));

export default router;
