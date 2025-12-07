import express, { json, Request, Response } from "express"
import initDB from "./config/db";
import { usersRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRouter } from "./modules/bookings/bookings.routes";


const app=express();
app.use(express.json())
app.use(express.urlencoded())

initDB()
app.get("/", (req: Request, res: Response) => {
    res.send("vehicle rental server")
})


app.use("/api/v1",usersRoutes)

app.use("/api/v1",vehiclesRoutes)

app.use("/api/v1",authRoutes)

app.use("/api/v1",bookingRouter)

export default app;