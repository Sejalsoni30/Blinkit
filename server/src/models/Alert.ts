import { Schema, model } from 'mongoose';

export type AlertType = 'SLA_RISK' | 'LOW_STOCK' | 'SURGE' | 'PICKER_SHORTAGE';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IAlert {
  alertId: string;
  type: AlertType;
  severity: AlertSeverity;
  storeId: string;
  message: string;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    alertId: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ['SLA_RISK', 'LOW_STOCK', 'SURGE', 'PICKER_SHORTAGE'],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
      index: true,
    },
    storeId: { type: String, required: true, index: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    resolved: { type: Boolean, default: false, index: true },
    resolvedAt: { type: Date },
    resolvedBy: { type: String },
  },
  { timestamps: true }
);

export const Alert = model<IAlert>('Alert', AlertSchema);
