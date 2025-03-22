
import express from 'express';
import {createDeliverySchedule,getDeliverySchedules} from "../../Application/DeliveryScheduling/DeliveryApp"


const router = express.Router();


// create delivery schedule
router.post('/delivery-schedules', async (req, res) => {
    const {
      deliveryScheduleId,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      deliveryDate,
      packageType,
      quantity,
      vehicle,
      driver,
      specialInstructions,
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude
    } = req.body;
  
    try {
      // Call the service function to create and save the new delivery schedule
      const newDeliverySchedule = await createDeliverySchedule(
        deliveryScheduleId,
        pickupLocation,
        dropoffLocation,
        pickupDate,
        deliveryDate,
        packageType,
        quantity,
        vehicle,
        driver,
        specialInstructions,
        pickupLatitude,
        pickupLongitude,
        dropoffLatitude,
        dropoffLongitude
      );
  
      // Return the created delivery schedule data as JSON
      res.status(201).json(newDeliverySchedule);
    } catch (error) {
      res.status(400).json({ message: 'Error creating delivery schedule', error });
    }
  });

  
  // get all delivery schedules
router.get('/delivery-schedules', async (req, res) => {
    try {
      const deliverySchedules = await getDeliverySchedules();
      res.status(200).json(deliverySchedules);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching delivery schedules', error });
    }
  });
  