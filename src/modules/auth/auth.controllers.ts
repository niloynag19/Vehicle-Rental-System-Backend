import { Request, Response } from "express";
import { authServices } from "./auth.services";


const loginUsers=async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    try {
        const result =await authServices.loginUsers(email,password);
        res.status(201).json({
            success:true,
            message:"Login successful",
            data: result
            
        })
    } catch ( error:any) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const authController={
    loginUsers,
}