import { pool } from "../../config/db"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import config from "../../config"


const loginUsers=async(email:string,password:string)=>{
    const result=await pool.query(`SELECT * FROM users WHERE email=$1`,[email])
    if(result.rows.length===0)
    {
        return null;
    }
    const user=result.rows[0];
    const match=await bcrypt.compare(password,user.password);
    if(!match)
    {
        return false;
    }

    const token=jwt.sign({id:user.id,name:user.name,email:user.email,phone:user.phone,role:user.role},config.jwtSecret as string,{expiresIn:"7d"})
    console.log(token);
    return {token, user};
}

export const authServices={
    loginUsers,
}