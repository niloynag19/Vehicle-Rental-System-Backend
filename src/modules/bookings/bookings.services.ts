import { pool } from "../../config/db";
import { vehiclesServices } from "../vehicles/vehicles.services";
import { JwtPayload } from "jsonwebtoken";

interface CreateBookingPayload {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
}

const createBooking = async (payload: CreateBookingPayload) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

   
    const vehicleResult = await vehiclesServices.getSingleVehicles(vehicle_id);
    if (vehicleResult.rows.length === 0) {
        return { success: false, message: "Vehicle not found" };
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== "available") {
        return { success: false, message: "Vehicle already booked" };
    }

    const now = new Date();
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    if (start <= now || end <= now) {
        return { 
            success: false, 
            message: "Start and end date must be in the future" 
        };
    }

    if (end <= start) {
        return { 
            success: false, 
            message: "End date must be after start date" 
        };
    }

    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (days < 1) {
        return { 
            success: false, 
            message: "Booking duration must be at least 1 day" 
        };
    }

    const total_price = vehicle.daily_rent_price * days;

    const booked = await pool.query(
        `INSERT INTO bookings 
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, "active"]
    );

    // Update vehicle status
    await pool.query(
        `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
        ["booked", vehicle_id]
    );

    return {
        success: true,
        message: "Booking created successfully",
        data: {
            ...booked.rows[0],
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price
            }
        }
    };
};


const getAllBookingRaw = async () => {
    const bookings = await pool.query(`SELECT * FROM bookings`);
    return bookings.rows;
};


const getSingleBookingRaw = async (bookingId: number) => {
    const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    if (bookingResult.rows.length === 0) return null;

    const booking = bookingResult.rows[0];

    const vehicleResult = await pool.query(
        `SELECT vehicle_name, registration_number, type FROM vehicles WHERE id=$1`,
        [booking.vehicle_id]
    );
    const vehicle = vehicleResult.rows[0];

    const customerResult = await pool.query(
        `SELECT id, name, email FROM users WHERE id=$1`,
        [booking.customer_id]
    );
    const customer = customerResult.rows[0];

    return { booking, vehicle, customer };
};

const updateBooking = async (bookingId: number, status: string, user: JwtPayload) => {
    if (!["cancelled", "returned"].includes(status)) {
        return { statusCode: 400, success: false, message: "Invalid status. Use 'cancelled' or 'returned'." };
    }

    const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    if (!bookingResult.rows.length) {
        return { statusCode: 404, success: false, message: "Booking not found" };
    }

    const booking = bookingResult.rows[0];
    const now = new Date();
    const rentStart = new Date(booking.rent_start_date);

    // customer
    if (user.role === "customer") {
        if (status !== "cancelled") {
            return { statusCode: 403, success: false, message: "Customers can only cancel bookings" };
        }

        if (now >= rentStart) {
            return { statusCode: 400, success: false, message: "Booking cannot be cancelled after start date" };
        }

        const updated = await pool.query(
            `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
            [bookingId]
        );

        return { 
            statusCode: 200, 
            success: true, 
            message: "Booking cancelled successfully", 
            data: updated.rows[0] 
        };
    }

    // admin
    if (user.role === "admin") {
        if (status !== "returned") {
            return { statusCode: 403, success: false, message: "Admin can only mark booking as returned" };
        }

        const updated = await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
            [bookingId]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
            [booking.vehicle_id]
        );

        return {
            statusCode: 200,
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
            data: { ...updated.rows[0], vehicle: { availability_status: "available" } }
        };
    }
    return { statusCode: 403, success: false, message: "Access denied" };
};

export const bookingServices = {
    createBooking,
    getAllBookingRaw,
    getSingleBookingRaw,
    updateBooking
};
