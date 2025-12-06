import bcrypt from "bcryptjs"
import { pool } from "../../config/db";


const createUsers= async(payload:Record<string,unknown>)=>{
    const {name,email,password,phone,role}=payload;

    const hashPassword=await bcrypt.hash(password as string,10);

    const result = await pool.query(
        `INSERT INTO users(name, email,password,phone,role) VALUES($1, $2, $3, $4, $5) RETURNING * `,
        [name, email,hashPassword,phone,role]
    );
    delete result.rows[0].password;
    return result;

    
}

const getAllUsers=async()=>{
    const result =await pool.query(`SELECT * FROM users`);
    return result;
}


export const userServices={
    createUsers,
}