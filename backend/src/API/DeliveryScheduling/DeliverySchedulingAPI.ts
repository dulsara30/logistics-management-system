
import express from 'express';
import {createDeliverySchedule,getDeliverySchedules,getDeliveryScheduleById} from "../../Application/DeliveryScheduling/DeliveryApp"


const router = express.Router();


// create delivery schedule
router.post('/Delivery', async (req, res) => {
    const {
      pickupLocation,
      dropoffLocation,
      deliveryDate,
      packageType,
      quantity,
      vehicle,
      driverName,
      driverUsername,
      specialInstructions,
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      status
    } = req.body;
  
    try {
      // Call the service function to create and save the new delivery schedule
      const newDeliverySchedule = await createDeliverySchedule(
        pickupLocation,
        dropoffLocation,
        deliveryDate,
        packageType,
        quantity,
        vehicle,
        driverName,
        driverUsername,
        specialInstructions,
        pickupLatitude,
        pickupLongitude,
        dropoffLatitude,
        dropoffLongitude,
        status
      );
  
      // Return the created delivery schedule data as JSON
      res.status(201).json(newDeliverySchedule);
    } catch (error) {
      res.status(400).json({ message: 'Error creating delivery schedule', error });
    }
  });

  


  // get all delivery schedules
router.get('/Delivery', async (req, res) => {
    try {
      const deliverySchedules = await getDeliverySchedules();
      res.status(200).json(deliverySchedules);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching delivery schedules', error });
    }
  });
  

// Get a specific delivery schedule by scheduleID

router.get('/Delivery/:Scheduleid', async (req, res) => {

  const { Scheduleid } = req.params; 
  
  try {

    const schedule = await getDeliveryScheduleById(Scheduleid); 
    res.json(schedule); 

  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule", error}); 
  }
});


  export default router;