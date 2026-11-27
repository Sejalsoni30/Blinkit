export type UserRole = 'ADMIN' | 'MANAGER' | 'ANALYST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
}

export interface DarkStore {
  storeId: string;
  name: string;
  city: string;
  address: string;
  geo: { lat: number; lng: number };
  capacity: number;
  operatingHours: { open: string; close: string };
  pickerCount: number;
  riderCount: number;
}

export interface StageDurations {
  assign: number;
  pick: number;
  pack: number;
  handover: number;
  ride: number;
}

export interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  aisle: string;
  rack: string;
}

export interface Substitution {
  originalSku: string;
  substituteSku: string;
  reason: string;
  approvedByCustomer: boolean;
  delaySeconds: number;
}

export interface Order {
  _id: string;
  orderId: string;
  storeId: string;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  placedAt: string;
  assignedAt?: string;
  pickStartAt?: string;
  pickEndAt?: string;
  packedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  status: string;
  delayReason: string;
  isBreached: boolean;
  totalDurationSeconds: number;
  stageDurations: StageDurations;
  pickerId?: string;
  riderId?: string;
  substitutions: Substitution[];
  aisleSpreadCount: number;
  weatherCondition?: string;
}

export interface OverviewMetrics {
  totalOrders: number;
  slaComplianceRate: number;
  breachedOrders: number;
  avgTotalSeconds: number;
  avgPickSeconds: number;
  substitutionRate: number;
  totalAmount: number;
  avgItemCount: number;
}

export interface TrendMetrics {
  slaChange: number;
  orderChange: number;
  breachChange: number;
  deliveryTimeChangeSec: number;
}

export interface StageFunnelItem {
  id: string;
  name: string;
  description: string;
  avgSeconds: number;
  p90Seconds: number;
  targetSeconds: number;
  isBottleneck: boolean;
}

export interface RootCauseItem {
  cause: string;
  label: string;
  count: number;
  percentage: number;
  avgDuration: number;
  recommendedAction: string;
  sampleOrders: {
    orderId: string;
    storeId: string;
    itemCount: number;
    totalDuration: number;
    placedAt: string;
  }[];
}

export interface Alert {
  alertId: string;
  type: 'SLA_RISK' | 'LOW_STOCK' | 'SURGE' | 'PICKER_SHORTAGE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  storeId: string;
  message: string;
  metadata?: Record<string, any>;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface SmartInsight {
  id: string;
  category: 'STAFFING' | 'AISLE_BOTTLENECK' | 'INVENTORY' | 'DISPATCH' | 'SLA_RISK';
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  recommendation: string;
  projectedSlaImpact: string;
  impactScore: number;
  storeId?: string;
}
