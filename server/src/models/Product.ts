import { Schema, model } from 'mongoose';

export interface IProduct {
  sku: string;
  name: string;
  category: string;
  aisle: string;
  rack: string;
  stock: number;
  reorderLevel: number;
  avgPickSeconds: number;
  unitPrice: number;
  weightGrams: number;
  isPopular: boolean;
  substitutionSku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    aisle: { type: String, required: true, index: true },
    rack: { type: String, required: true },
    stock: { type: Number, required: true, default: 50 },
    reorderLevel: { type: Number, required: true, default: 15 },
    avgPickSeconds: { type: Number, default: 25 },
    unitPrice: { type: Number, required: true },
    weightGrams: { type: Number, default: 500 },
    isPopular: { type: Boolean, default: false },
    substitutionSku: { type: String },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', ProductSchema);
