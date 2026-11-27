import { Schema, model } from 'mongoose';

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
export type ExperienceLevel = 'JUNIOR' | 'MID' | 'SENIOR';

export interface IPicker {
  pickerId: string;
  name: string;
  storeId: string;
  shift: ShiftType;
  experienceLevel: ExperienceLevel;
  experienceMonths: number;
  rating: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PickerSchema = new Schema<IPicker>(
  {
    pickerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    storeId: { type: String, required: true, index: true },
    shift: {
      type: String,
      enum: ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'],
      required: true,
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['JUNIOR', 'MID', 'SENIOR'],
      default: 'MID',
    },
    experienceMonths: { type: Number, default: 12 },
    rating: { type: Number, default: 4.8 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Picker = model<IPicker>('Picker', PickerSchema);
