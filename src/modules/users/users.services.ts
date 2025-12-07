import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUsers = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    const pass = password as string;
    if (pass.length >= 6) {
        const hashPassword = await bcrypt.hash(pass, 10);

        const result = await pool.query(
            `INSERT INTO users(name, email,password,phone,role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [name, (email as string).toLowerCase(), hashPassword, phone, role]
        );

        delete result.rows[0].password;
        return result;
    } else {
        return "password minimum 6 character";
    }
};


const getAllUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    result.rows.map(user=>delete user.password)
    return result;
};

const getSingleUsers = async (id: number) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    result.rows.length>0?delete result.rows[0].password:result
    return result;
};

const putUsers = async (name: string, email: string, phone: string, role: string, id: number) => {
    const result = await pool.query(
        `UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`,
        [name, email, phone, role, id]
    );
    result.rows.length>0?delete result.rows[0].password:result
    return result;
};

const deleteUsers = async (id: number) => {
    const isExists = await pool.query(
        `SELECT * FROM bookings WHERE customer_id = $1 AND status = $2`,
        [id, 'active']
    );

    if (isExists.rows.length > 0) {
        return {
            success: false,
            message: "Active booking is available so you can not delete account now"
        };
    }
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [id]
    );
    return {
        success: true,
        data: result.rows[0]
    };
};


export const userServices = {
    createUsers,
    getAllUsers,
    getSingleUsers,
    putUsers,
    deleteUsers
};
