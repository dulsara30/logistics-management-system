import deliveryScheduleSchema from '../../Infrastructure/schemas/DeliverySchduling/DeliveryScheduleSchema'; // adjust the path as needed

// Create a new delivery schedule
export const createDeliverySchedule = async (
  deliveryScheduleId: string,
  pickupLocation: string,
  dropoffLocation: string,
  pickupDate: Date,
  deliveryDate: Date,
  packageType: string,
  quantity: number,
  vehicle: string,
  driver: string,
  specialInstructions: string,
  pickupLatitude: number | null,
  pickupLongitude: number | null,
  dropoffLatitude: number | null,
  dropoffLongitude: number | null
) => {
  try {
    // Create a new delivery schedule instance with the provided data
    const newDeliverySchedule = new deliveryScheduleSchema({
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
      dropoffLongitude,
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
