import { Router } from "express"
import { vehiclesController } from "./vehicles.controllers";

const router=Router();

router.post('/vehicles',vehiclesController.createVehicles);
router.get('/vehicles',vehiclesController.getAllVehicles);
router.get('/vehicles/:id',vehiclesController.getSingleVehicles);
router.put('/vehicles/:id',vehiclesController.putVehicles)
router.delete('/vehicles/:id',vehiclesController.deleteVehicles);


export const vehiclesRoutes=router;