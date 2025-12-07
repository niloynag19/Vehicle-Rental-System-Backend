import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./bookings.controllers";

const router = Router();

router.post('/bookings', auth('admin','customer'), bookingControllers.createBooking);

router.get('/bookings', auth('admin','customer'), bookingControllers.getAllBooking);

router.get('/bookings/:bookingId', auth('admin','customer'), bookingControllers.getSingleBooking);

router.put('/bookings/:bookingId', auth('admin','customer'), bookingControllers.updateBooking);

export const bookingRouter = router;
