import { json, Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";


const createVehicles=async(req:Request,res:Response)=>{
    try {
        const result=await vehiclesServices.createVehicles(req.body)
        res.status(201).json({
            success:true,
            message:"Vehicle created successfully",
            data:result.rows[0],
        })
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

const getAllVehicles=async(req:Request,res:Response)=>{
    try {
        const result=await vehiclesServices.getAllVehicles();
        res.status(201).json({
            success:true,
            message:"Vehicles retrieved successfully",
            data:result.rows,
        })
        
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const getSingleVehicles=async(req:Request,res:Response)=>{
    try {
       const result=await vehiclesServices.getSingleVehicles(req.params.id as string) 
       if(result.rows.length===0)
       {
            res.status(404).json({
                success:false,
                message:"User Not Found"
            })
       }
       else 
       {
            res.status(201).json({
                success:true,
                message:"Vehicle retrieved successfully",
                data:result.rows[0],
            })
       }
    } catch ( error:any) {
        res.status(201).json({
            success:false,
            message:error.message,
        })
    }
}

const putVehicles=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params;
        const payload=req.body;
        const result=await vehiclesServices.putVehicles(payload,id!)
        if(result.rows.length===0)
        {
            res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        else{
            res.status(201).json({
                success:true,
                message:"Vehicle updated successfully",
                data:result.rows[0]
            })
        }
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteVehicles =  async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deleteVehicles(req.params.id as string)
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
        data: null
      })
    }

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const vehiclesController={
    createVehicles,
    getAllVehicles,
    getSingleVehicles,
    putVehicles,
    deleteVehicles
}