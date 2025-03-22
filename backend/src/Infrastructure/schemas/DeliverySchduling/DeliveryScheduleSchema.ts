import mongoose, { Schema } from 'mongoose';

const deliveryScheduleSchema: Schema = new Schema(
  {
    deliveryScheduleId: {
      type: String,
      required: true,
      unique: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
    },
 
    deliveryDate: {
      type: Date,
      required: true,
    },
    packageType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    vehicle: {
      type: String,
      default: null,
    },
    driverName: {
      type: String,
      required: true,
    },

    driverUsername: {
        type: String,
        required: true,
      },

    specialInstructions: {
      type: String,
      default: '',
    },
    pickupLatitude: {
      type: Number,
      default: null,
    },
    pickupLongitude: {
      type: Number,
      default: null,
    },
    dropoffLatitude: {
      type: Number,
      default: null,
    },
    dropoffLongitude: {
      type: Number,
      default: null,
    },

    status :{
        type : String,
    }
  }
);

const DeliverySchedule = mongoose.model('DeliverySchedule', deliveryScheduleSchema);

export default DeliverySchedule;
