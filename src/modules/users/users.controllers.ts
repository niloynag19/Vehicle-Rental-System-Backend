import { Request, Response } from "express";
import { userServices } from "./users.services";

const createUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.createUsers(req.body);
        if (typeof result === 'string') {
            res.status(500).json({
                success: false,
                message: "User not found",
            })
        } else {
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result.rows[0],
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
       const result = await userServices.getAllUsers();
       res.status(200).json({  
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
       }) 
    } catch (error: any) {
       res.status(500).json({
        success: false,
        message: error.message
       }) 
    }
}

const getSingleUsers = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);  
        const result = await userServices.getSingleUsers(id)
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const putUsers = async (req: Request, res: Response) => {
    const { name, email, phone, role } = req.body;
    try {
        const id = Number(req.params.id); 
        const result = await userServices.putUsers(name, email, phone, role, id)
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const deleteUsers = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const result = await userServices.deleteUsers(id);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const usersController = {
    createUsers,
    getAllUsers,
    getSingleUsers,
    putUsers,
    deleteUsers
}
