import express, { json, Request, Response } from "express"
import initDB from "./config/db";
import { usersRoutes } from "./modules/users/users.routes";


const app=express();
app.use(express.json())
app.use(express.urlencoded())

initDB()

app.use("/users/api/v1",usersRoutes)

app.get("/",(req:Request,res:Response)=>{
    res.status(201).json({
        success:true,
        message:"get successfully",
        path:req.path,
    })
})

export default app;