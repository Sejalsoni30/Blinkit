import { Schema, model } from 'mongoose';

export type OrderStatus =
  | 'placed'
  | 'assigned'
  | 'picking'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type DelayReason =
  | 'NONE'
  | 'SLOW_PICK'
  | 'PACKING_QUEUE'
  | 'RIDER_WAIT'
  | 'STOCKOUT_SUBSTITUTION'
  | 'TRAFFIC_RAIN';

export interface IOrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  aisle: string;
  rack: string;
}

export interface ISubstitution {
  originalSku: string;
  substituteSku: string;
  reason: string;
  approvedByCustomer: boolean;
  delaySeconds: number;
}

export interface IStageDurations {
  assign: number;
  pick: number;
  pack: number;
  handover: number;
  ride: number;
}

export interface IOrder {
  _id?: any;
  orderId: string;
  storeId: string;
  items: IOrderItem[];
  itemCount: number;
  totalAmount: number;
  placedAt: Date;
  assignedAt?: Date;
  pickStartAt?: Date;
  pickEndAt?: Date;
  packedAt?: Date;
  dispatchedAt?: Date;
  deliveredAt?: Date;
  status: OrderStatus;
  delayReason: DelayReason;
  isBreached: boolean;
  totalDurationSeconds: number;
  stageDurations: IStageDurations;
  pickerId?: string;
  riderId?: string;
  substitutions: ISubstitution[];
  aisleSpreadCount: number;
  weatherCondition?: 'CLEAR' | 'RAIN' | 'EXTREME_HEAT';
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    storeId: { type: String, required: true, index: true },
    items: [
      {
        sku: { type: String, required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        aisle: { type: String, required: true },
        rack: { type: String, required: true },
      },
    ],
    itemCount: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true, default: 0 },
    placedAt: { type: Date, required: true, index: true },
    assignedAt: { type: Date },
    pickStartAt: { type: Date },
    pickEndAt: { type: Date },
    packedAt: { type: Date },
    dispatchedAt: { type: Date },
    deliveredAt: { type: Date },
    status: {
      type: String,
      enum: ['placed', 'assigned', 'picking', 'packed', 'dispatched', 'delivered', 'cancelled'],
      default: 'delivered',
      index: true,
    },
    delayReason: {
      type: String,
      enum: ['NONE', 'SLOW_PICK', 'PACKING_QUEUE', 'RIDER_WAIT', 'STOCKOUT_SUBSTITUTION', 'TRAFFIC_RAIN'],
      default: 'NONE',
      index: true,
    },
    isBreached: { type: Boolean, default: false, index: true },
    totalDurationSeconds: { type: Number, default: 0 },
    stageDurations: {
      assign: { type: Number, default: 0 },
      pick: { type: Number, default: 0 },
      pack: { type: Number, default: 0 },
      handover: { type: Number, default: 0 },
      ride: { type: Number, default: 0 },
    },
    pickerId: { type: String, index: true },
    riderId: { type: String, index: true },
    substitutions: [
      {
        originalSku: { type: String, required: true },
        substituteSku: { type: String, required: true },
        reason: { type: String, required: true },
        approvedByCustomer: { type: Boolean, default: true },
        delaySeconds: { type: Number, default: 0 },
      },
    ],
    aisleSpreadCount: { type: Number, default: 1 },
    weatherCondition: {
      type: String,
      enum: ['CLEAR', 'RAIN', 'EXTREME_HEAT'],
      default: 'CLEAR',
    },
  },
  { timestamps: true }
);

OrderSchema.index({ storeId: 1, placedAt: -1 });
OrderSchema.index({ storeId: 1, isBreached: 1, placedAt: -1 });
OrderSchema.index({ placedAt: -1, isBreached: 1 });
OrderSchema.index({ pickerId: 1, placedAt: -1 });

export const Order = model<IOrder>('Order', OrderSchema);
