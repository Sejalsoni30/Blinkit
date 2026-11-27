import { Schema, model } from 'mongoose';

export interface IRider {
  riderId: string;
  name: string;
  storeId: string;
  avgHandoverSeconds: number;
  vehicleType: 'EV_BIKE' | 'PETROL_BIKE' | 'CYCLE';
  rating: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const RiderSchema = new Schema<IRider>(
  {
    riderId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    storeId: { type: String, required: true, index: true },
    avgHandoverSeconds: { type: Number, default: 45 },
    vehicleType: {
      type: String,
      enum: ['EV_BIKE', 'PETROL_BIKE', 'CYCLE'],
      default: 'EV_BIKE',
    },
    rating: { type: Number, default: 4.9 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Rider = model<IRider>('Rider', RiderSchema);
