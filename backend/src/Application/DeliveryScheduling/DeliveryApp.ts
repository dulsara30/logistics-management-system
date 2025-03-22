import deliveryScheduleSchema from '../../Infrastructure/schemas/DeliverySchduling/DeliveryScheduleSchema'; // adjust the path as needed
import shortid from 'shortid';



// Create a new delivery schedule
export const createDeliverySchedule = async (

  pickupLocation: string,
  dropoffLocation: string,
  deliveryDate: Date,
  packageType: string,
  quantity: number,
  vehicle: string,
  driverName: string,
  driverUsername : string,
  specialInstructions: string,
  pickupLatitude: number | null,
  pickupLongitude: number | null,
  dropoffLatitude: number | null,
  dropoffLongitude: number | null,
  status : string

) => {
  try {

    let deliveryScheduleId = shortid.generate();  // Generate a unique short ID

    // Check if the deliveryScheduleId already exists in the database
    let existingSchedule = await deliveryScheduleSchema.findOne({ deliveryScheduleId });
    while (existingSchedule) {
      // If the ID already exists, generate a new one
      deliveryScheduleId = shortid.generate();
      existingSchedule = await deliveryScheduleSchema.findOne({ deliveryScheduleId });
    }

    // Create a new delivery schedule instance with the provided data
    const newDeliverySchedule = new deliveryScheduleSchema({

      deliveryScheduleId,
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
    });

    // Save the new delivery schedule to the database and return the result
    const savedDeliverySchedule = await newDeliverySchedule.save();
    return savedDeliverySchedule;

  } catch (error) {
    console.error("Error creating delivery schedule:", error);
    throw new Error("Error creating delivery schedule");
  }
};

// Get all delivery schedules
export const getDeliverySchedules = async () => {
  try {
    const deliverySchedules = await deliveryScheduleSchema.find(); // fetch all delivery schedules from the collection
    return deliverySchedules;
  } catch (error) {
    console.error("Error retrieving delivery schedules:", error);
    throw new Error("Error retrieving delivery schedules");
  }
};


// Get a delivery schedule by scheduleID
export const getDeliveryScheduleById = (deliveryScheduleId: string): any => {

  
  return deliveryScheduleSchema.findOne({deliveryScheduleId}) // fetch schedule by ID from the collection

    .then((deliverySchedule) => {

      if (!deliverySchedule) {
        throw new Error(`Delivery schedule with ID ${deliveryScheduleId} not found.`);
      }
      return deliverySchedule;

    })

    .catch((error) => {
      console.error("Error retrieving delivery schedule:", error);
      throw new Error("Error retrieving delivery schedule");
    });
};