import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";
import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBooking = async (req: Request, res: Response) => {
    try {
        const payload = {
            customer_id: Number(req.body.customer_id),
            vehicle_id: Number(req.body.vehicle_id),
            rent_start_date: req.body.rent_start_date,
            rent_end_date: req.body.rent_end_date
        };

        const result = await bookingServices.createBooking(payload);
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};

// get all booking
const getAllBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user as JwtPayload;
        const bookings = await bookingServices.getAllBookingRaw();

        // admin view
        if (user.role === "admin") {
            const results = [];
            for (let b of bookings) {
                const customer = await pool.query(`SELECT id, name, email FROM users WHERE id=$1`, 
                    [b.customer_id]);

                const vehicle = await pool.query(`SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1`, 
                    [b.vehicle_id]);
                    
                results.push({ ...b, customer: customer.rows[0], vehicle: vehicle.rows[0] });
            }
            return res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: results
            });
        }

        // customer view
        const customerResults = [];
        for (let b of bookings.filter(b => b.customer_id === Number(user.id))) {
            const vehicle = await pool.query(`SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1`, 
                [b.vehicle_id]);

            customerResults.push({
                id: b.id,
                vehicle_id: b.vehicle_id,
                rent_start_date: b.rent_start_date,
                rent_end_date: b.rent_end_date,
                total_price: b.total_price,
                status: b.status,
                vehicle: vehicle.rows[0]
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: "Your bookings retrieved successfully", 
            data: customerResults });

    } catch (error: any) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};

// get single booking
const getSingleBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user as JwtPayload;
        const bookingId = Number(req.params.bookingId);

        const data = await bookingServices.getSingleBookingRaw(bookingId);
        if (!data) return res.status(404).json({ 
            success: false, 
            message: "Booking not found" 
        });

        const { booking, vehicle, customer } = data;


        if (user.role === "admin") {
            return res.status(200).json({
                success: true,
                message: "Booking retrieved successfully",
                data: [{ ...booking, customer, vehicle }]
            });
        }

        // customer view
        return res.status(200).json({
            success: true,
            message: "Your booking retrieved successfully",
            data: [{
                id: booking.id,
                vehicle_id: booking.vehicle_id,
                rent_start_date: booking.rent_start_date,
                rent_end_date: booking.rent_end_date,
                total_price: booking.total_price,
                status: booking.status,
                vehicle
            }]
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};

// update booking
const updateBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user as JwtPayload;
        const bookingId = Number(req.params.bookingId);
        const status = req.body.status;

        const result = await bookingServices.updateBooking(bookingId, status, user);
        return res.status(result.statusCode || 200).json({ 
            success: result.success, 
            message: result.message, 
            data: result.data || null });

    } catch (error: any) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};

export const bookingControllers = {
    createBooking,
    getAllBooking,
    getSingleBooking,
    updateBooking
};
