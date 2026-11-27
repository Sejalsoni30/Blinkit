import { Schema, model } from 'mongoose';

export interface IDarkStore {
  storeId: string;
  name: string;
  city: string;
  address: string;
  geo: {
    lat: number;
    lng: number;
  };
  capacity: number;
  operatingHours: {
    open: string;
    close: string;
  };
  pickerCount: number;
  riderCount: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const DarkStoreSchema = new Schema<IDarkStore>(
  {
    storeId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    geo: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    capacity: { type: Number, default: 250 },
    operatingHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '23:59' },
    },
    pickerCount: { type: Number, default: 12 },
    riderCount: { type: Number, default: 20 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DarkStore = model<IDarkStore>('DarkStore', DarkStoreSchema);
