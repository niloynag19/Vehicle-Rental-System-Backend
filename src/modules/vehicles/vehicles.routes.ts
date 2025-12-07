import { Router } from "express"
import { vehiclesController } from "./vehicles.controllers";
import auth from "../../middleware/auth";

const router=Router();

router.post('/vehicles',auth('admin'),vehiclesController.createVehicles);

router.get('/vehicles',vehiclesController.getAllVehicles);

router.get('/vehicles/:id',vehiclesController.getSingleVehicles);

router.put('/vehicles/:id',auth('admin'),vehiclesController.putVehicles)

router.delete('/vehicles/:id',auth('admin'),vehiclesController.deleteVehicles);


export const vehiclesRoutes=router;