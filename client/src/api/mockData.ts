// Standalone demo data for zero-config deployments (e.g. Vercel static preview)
import {
  User,
  DarkStore,
  OverviewMetrics,
  TrendMetrics,
  StageFunnelItem,
  RootCauseItem,
  Order,
  Alert,
  SmartInsight,
} from '../types/index.js';

export const MOCK_USERS: Record<string, User> = {
  'admin@blinkit.com': {
    id: 'usr-admin',
    name: 'Aarav Sharma (Ops Head)',
    email: 'admin@blinkit.com',
    role: 'ADMIN',
  },
  'manager.blr@blinkit.com': {
    id: 'usr-mgr-blr',
    name: 'Priya Sundaram (Manager BLR)',
    email: 'manager.blr@blinkit.com',
    role: 'MANAGER',
    storeId: 'BLR-KOR-01',
  },
  'manager.del@blinkit.com': {
    id: 'usr-mgr-del',
    name: 'Rohit Verma (Manager DEL)',
    email: 'manager.del@blinkit.com',
    role: 'MANAGER',
    storeId: 'DEL-IND-02',
  },
  'analyst@blinkit.com': {
    id: 'usr-analyst',
    name: 'Ananya Iyer (Analyst)',
    email: 'analyst@blinkit.com',
    role: 'ANALYST',
  },
};

export const MOCK_STORES: DarkStore[] = [
  {
    storeId: 'BLR-KOR-01',
    name: 'Koramangala 4th Block Hub',
    city: 'Bengaluru',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    geo: { lat: 12.9352, lng: 77.6245 },
    capacity: 250,
    operatingHours: { open: '06:00', close: '23:59' },
    pickerCount: 15,
    riderCount: 26,
  },
  {
    storeId: 'DEL-IND-02',
    name: 'Indirapuram Express Dark Store',
    city: 'Delhi NCR',
    address: 'Vaibhav Khand, Indirapuram, Ghaziabad, UP 201014',
    geo: { lat: 28.6389, lng: 77.3712 },
    capacity: 220,
    operatingHours: { open: '06:00', close: '23:59' },
    pickerCount: 12,
    riderCount: 20,
  },
  {
    storeId: 'MUM-AND-03',
    name: 'Andheri West Central Warehouse',
    city: 'Mumbai',
    address: 'Link Road, Lokhandwala Complex, Andheri West, Mumbai, MH 400053',
    geo: { lat: 19.1363, lng: 72.8277 },
    capacity: 280,
    operatingHours: { open: '06:00', close: '23:59' },
    pickerCount: 16,
    riderCount: 28,
  },
  {
    storeId: 'GGN-SEC-04',
    name: 'Sector 29 Prime Fulfilment',
    city: 'Gurugram',
    address: 'Leisure Valley Road, Sector 29, Gurugram, Haryana 122001',
    geo: { lat: 28.4682, lng: 77.0635 },
    capacity: 200,
    operatingHours: { open: '06:00', close: '23:59' },
    pickerCount: 11,
    riderCount: 18,
  },
  {
    storeId: 'HYD-HIT-05',
    name: 'Hitec City Fast-Hub',
    city: 'Hyderabad',
    address: 'Madhapur Main Road, HITEC City, Hyderabad, Telangana 500081',
    geo: { lat: 17.4435, lng: 78.3772 },
    capacity: 240,
    operatingHours: { open: '06:00', close: '23:59' },
    pickerCount: 13,
    riderCount: 22,
  },
];

export const MOCK_OVERVIEW: { metrics: OverviewMetrics; trend: TrendMetrics } = {
  metrics: {
    totalOrders: 10000,
    slaComplianceRate: 91.2,
    breachedOrders: 880,
    avgTotalSeconds: 440,
    avgPickSeconds: 155,
    substitutionRate: 2.1,
    totalAmount: 3845000,
    avgItemCount: 4.2,
  },
  trend: {
    slaChange: 1.4,
    orderChange: 5.2,
    breachChange: -3.8,
    deliveryTimeChangeSec: -14,
  },
};

export const MOCK_STAGES: StageFunnelItem[] = [
  {
    id: 'assign',
    name: 'Order Assignment',
    description: 'Placed to Picker Assigned',
    avgSeconds: 21,
    p90Seconds: 32,
    targetSeconds: 25,
    isBottleneck: false,
  },
  {
    id: 'pick',
    name: 'Item Picking',
    description: 'Picker picking items across aisles',
    avgSeconds: 155,
    p90Seconds: 220,
    targetSeconds: 180,
    isBottleneck: false,
  },
  {
    id: 'pack',
    name: 'Bagging & QC Pack',
    description: 'Verification, bagging & sealing',
    avgSeconds: 44,
    p90Seconds: 65,
    targetSeconds: 50,
    isBottleneck: false,
  },
  {
    id: 'handover',
    name: 'Rider Handover',
    description: 'Bag handoff to delivery rider',
    avgSeconds: 42,
    p90Seconds: 58,
    targetSeconds: 45,
    isBottleneck: false,
  },
  {
    id: 'ride',
    name: 'Rider Transit (Last Mile)',
    description: 'Rider transit to customer doorstep',
    avgSeconds: 178,
    p90Seconds: 260,
    targetSeconds: 240,
    isBottleneck: false,
  },
];

export const MOCK_CAUSES: RootCauseItem[] = [
  {
    cause: 'SLOW_PICK',
    label: 'Picking Inefficiency & Aisle Congestion',
    count: 298,
    percentage: 33.9,
    avgDuration: 672,
    recommendedAction: 'Relocate top-picked SKUs closer to packing station; retrain junior pickers.',
    sampleOrders: [
      { orderId: 'BLK-BLR-100241', storeId: 'BLR-KOR-01', itemCount: 6, totalDuration: 685, placedAt: '2026-11-26T18:32:00Z' },
      { orderId: 'BLK-DEL-100512', storeId: 'DEL-IND-02', itemCount: 7, totalDuration: 710, placedAt: '2026-11-26T19:15:00Z' },
      { orderId: 'BLK-MUM-100892', storeId: 'MUM-AND-03', itemCount: 5, totalDuration: 665, placedAt: '2026-11-26T20:04:00Z' },
    ],
  },
  {
    cause: 'PACKING_QUEUE',
    label: 'QC & Bagging Station Congestion',
    count: 194,
    percentage: 22.0,
    avgDuration: 648,
    recommendedAction: 'Add second packing bench or pre-print order bags during surge windows.',
    sampleOrders: [
      { orderId: 'BLK-GGN-101140', storeId: 'GGN-SEC-04', itemCount: 4, totalDuration: 652, placedAt: '2026-11-26T19:40:00Z' },
      { orderId: 'BLK-HYD-101455', storeId: 'HYD-HIT-05', itemCount: 5, totalDuration: 660, placedAt: '2026-11-26T20:25:00Z' },
    ],
  },
  {
    cause: 'RIDER_WAIT',
    label: 'Rider Handover Queue Delay',
    count: 176,
    percentage: 20.0,
    avgDuration: 660,
    recommendedAction: 'Improve staging bay assignment; pre-dispatch rider when order enters packing.',
    sampleOrders: [
      { orderId: 'BLK-BLR-101890', storeId: 'BLR-KOR-01', itemCount: 3, totalDuration: 675, placedAt: '2026-11-26T21:10:00Z' },
    ],
  },
  {
    cause: 'STOCKOUT_SUBSTITUTION',
    label: 'Stockout / Substitution Latency',
    count: 123,
    percentage: 14.0,
    avgDuration: 690,
    recommendedAction: 'Auto-approve top 3 substitution candidates; sync reorder triggers.',
    sampleOrders: [
      { orderId: 'BLK-DEL-102104', storeId: 'DEL-IND-02', itemCount: 4, totalDuration: 705, placedAt: '2026-11-26T14:18:00Z' },
    ],
  },
  {
    cause: 'TRAFFIC_RAIN',
    label: 'Extreme Weather / Last-Mile Transit',
    count: 89,
    percentage: 10.1,
    avgDuration: 735,
    recommendedAction: 'Dynamic geofence restriction (reduce radius to 1.5km during heavy downpour).',
    sampleOrders: [
      { orderId: 'BLK-MUM-102550', storeId: 'MUM-AND-03', itemCount: 3, totalDuration: 742, placedAt: '2026-11-26T19:55:00Z' },
    ],
  },
];

export const MOCK_HOURLY = Array.from({ length: 24 }, (_, hour) => {
  let orderCount = 15;
  let slaCompliance = 94.5;
  if (hour >= 8 && hour <= 10) {
    orderCount = 42 + (hour % 3) * 6;
    slaCompliance = 89.2;
  } else if (hour >= 18 && hour <= 22) {
    orderCount = 52 + (hour % 4) * 5;
    slaCompliance = 86.8;
  } else if (hour >= 11 && hour <= 17) {
    orderCount = 28 + (hour % 5) * 3;
    slaCompliance = 93.1;
  } else {
    orderCount = 8 + (hour % 2) * 3;
    slaCompliance = 96.0;
  }
  const breachCount = Math.round(orderCount * ((100 - slaCompliance) / 100));
  return {
    hour,
    orderCount,
    breachCount,
    slaCompliance,
    avgPickSeconds: Math.round(135 + orderCount * 0.6),
    avgTotalSeconds: Math.round(390 + orderCount * 1.2),
  };
});

export const MOCK_HEATMAP = (() => {
  const aisles = ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4', 'Aisle 5', 'Aisle 6', 'Aisle 7', 'Aisle 8'];
  const res: { aisle: string; hour: number; picksCount: number; avgPickSeconds: number }[] = [];
  aisles.forEach((aisle, aIdx) => {
    for (let h = 0; h < 24; h++) {
      const isPeak = (h >= 8 && h <= 10) || (h >= 18 && h <= 22);
      const isPopularAisle = aIdx === 1 || aIdx === 2; // Produce & Snacks
      const basePicks = isPopularAisle ? 12 : 5;
      const picksCount = isPeak ? basePicks * 3 + (h % 5) : basePicks + (h % 3);
      const avgPickSeconds = Math.round(18 + aIdx * 3 + (isPeak ? 12 : 0));
      res.push({ aisle, hour: h, picksCount, avgPickSeconds });
    }
  });
  return res;
})();

export const MOCK_SLOW_SKUS = [
  { sku: 'SKU-1009', name: 'Hybrid Tomato 1kg (Pre-packed)', aisle: 'Aisle 2', totalUnits: 1420, avgOrderPickSeconds: 215, breachRate: 18.4 },
  { sku: 'SKU-1010', name: 'Red Onion Fresh 1kg Sack', aisle: 'Aisle 2', totalUnits: 1280, avgOrderPickSeconds: 208, breachRate: 17.2 },
  { sku: 'SKU-1017', name: "Lay's India's Magic Masala 50g", aisle: 'Aisle 3', totalUnits: 1890, avgOrderPickSeconds: 195, breachRate: 15.1 },
  { sku: 'SKU-1024', name: 'Coca-Cola Zero Sugar 300ml Can', aisle: 'Aisle 4', totalUnits: 1150, avgOrderPickSeconds: 192, breachRate: 14.8 },
  { sku: 'SKU-1033', name: 'Dettol Original Germ Soap 75g', aisle: 'Aisle 7', totalUnits: 980, avgOrderPickSeconds: 189, breachRate: 13.9 },
  { sku: 'SKU-1001', name: 'Amul Taaza Toned Fresh Milk 500ml', aisle: 'Aisle 1', totalUnits: 2450, avgOrderPickSeconds: 184, breachRate: 13.2 },
  { sku: 'SKU-1025', name: 'Maggi 2-Minute Masala Noodles 70g', aisle: 'Aisle 5', totalUnits: 2100, avgOrderPickSeconds: 179, breachRate: 12.5 },
  { sku: 'SKU-1039', name: 'Ariel Matic Front Load Detergent 1kg', aisle: 'Aisle 8', totalUnits: 760, avgOrderPickSeconds: 176, breachRate: 12.1 },
  { sku: 'SKU-1014', name: 'Royal Gala Apple 4 pcs Pack', aisle: 'Aisle 2', totalUnits: 890, avgOrderPickSeconds: 172, breachRate: 11.8 },
  { sku: 'SKU-1002', name: 'Amul Butter Salted 100g', aisle: 'Aisle 1', totalUnits: 1650, avgOrderPickSeconds: 168, breachRate: 11.0 },
];

export const MOCK_LEADERBOARD = [
  { storeId: 'BLR-KOR-01', storeName: 'Koramangala 4th Block Hub', city: 'Bengaluru', slaCompliance: 92.4, totalOrders: 2480, breachedOrders: 188, avgDeliverySeconds: 432, avgPickSeconds: 152, capacity: 250 },
  { storeId: 'DEL-IND-02', storeName: 'Indirapuram Express Dark Store', city: 'Delhi NCR', slaCompliance: 91.8, totalOrders: 2150, breachedOrders: 176, avgDeliverySeconds: 438, avgPickSeconds: 156, capacity: 220 },
  { storeId: 'MUM-AND-03', storeName: 'Andheri West Central Warehouse', city: 'Mumbai', slaCompliance: 90.6, totalOrders: 2790, breachedOrders: 262, avgDeliverySeconds: 449, avgPickSeconds: 161, capacity: 280 },
  { storeId: 'HYD-HIT-05', storeName: 'Hitec City Fast-Hub', city: 'Hyderabad', slaCompliance: 90.2, totalOrders: 1820, breachedOrders: 178, avgDeliverySeconds: 452, avgPickSeconds: 159, capacity: 240 },
  { storeId: 'GGN-SEC-04', storeName: 'Sector 29 Prime Fulfilment', city: 'Gurugram', slaCompliance: 89.4, totalOrders: 1460, breachedOrders: 155, avgDeliverySeconds: 458, avgPickSeconds: 165, capacity: 200 },
];

export const MOCK_PICKERS = [
  { pickerId: 'PKR-0001', name: 'Ramesh Kumar (BLR)', storeId: 'BLR-KOR-01', shift: 'MORNING', experienceLevel: 'SENIOR', totalOrders: 342, ordersPerHour: 11.4, avgPickSeconds: 138, breachRate: 6.2, rating: 4.95 },
  { pickerId: 'PKR-0002', name: 'Deepak Joshi (BLR)', storeId: 'BLR-KOR-01', shift: 'EVENING', experienceLevel: 'SENIOR', totalOrders: 328, ordersPerHour: 10.9, avgPickSeconds: 142, breachRate: 7.1, rating: 4.90 },
  { pickerId: 'PKR-0003', name: 'Vikram Singh (DEL)', storeId: 'DEL-IND-02', shift: 'MORNING', experienceLevel: 'MID', totalOrders: 295, ordersPerHour: 9.8, avgPickSeconds: 151, breachRate: 8.4, rating: 4.82 },
  { pickerId: 'PKR-0004', name: 'Manoj Patil (MUM)', storeId: 'MUM-AND-03', shift: 'EVENING', experienceLevel: 'MID', totalOrders: 284, ordersPerHour: 9.5, avgPickSeconds: 154, breachRate: 9.2, rating: 4.78 },
  { pickerId: 'PKR-0005', name: 'Suresh Nair (HYD)', storeId: 'HYD-HIT-05', shift: 'AFTERNOON', experienceLevel: 'JUNIOR', totalOrders: 220, ordersPerHour: 7.8, avgPickSeconds: 172, breachRate: 13.8, rating: 4.62 },
];

export const MOCK_INVENTORY_ITEMS = [
  { sku: 'SKU-1001', name: 'Amul Taaza Toned Fresh Milk 500ml', category: 'Dairy & Breakfast', aisle: 'Aisle 1', rack: 'R-02', currentStock: 8, reorderLevel: 25, unitPrice: 28, dailyVelocity: 36, daysOfCover: 0.2, riskLevel: 'CRITICAL', suggestedReorderQty: 67, substitutionSku: 'SKU-1002' },
  { sku: 'SKU-1009', name: 'Hybrid Tomato 1kg', category: 'Fruits & Vegetables', aisle: 'Aisle 2', rack: 'R-04', currentStock: 12, reorderLevel: 30, unitPrice: 42, dailyVelocity: 28, daysOfCover: 0.4, riskLevel: 'CRITICAL', suggestedReorderQty: 78, substitutionSku: 'SKU-1011' },
  { sku: 'SKU-1017', name: "Lay's Magic Masala 50g", category: 'Snacks & Munchies', aisle: 'Aisle 3', rack: 'R-01', currentStock: 15, reorderLevel: 20, unitPrice: 20, dailyVelocity: 18, daysOfCover: 0.8, riskLevel: 'HIGH', suggestedReorderQty: 45, substitutionSku: 'SKU-1018' },
  { sku: 'SKU-1025', name: 'Maggi 2-Minute Noodles 70g', category: 'Instant Food', aisle: 'Aisle 5', rack: 'R-03', currentStock: 18, reorderLevel: 25, unitPrice: 14, dailyVelocity: 22, daysOfCover: 0.8, riskLevel: 'HIGH', suggestedReorderQty: 57, substitutionSku: 'SKU-1026' },
];

export const MOCK_INSIGHTS: SmartInsight[] = [
  {
    id: 'INS-01',
    category: 'STAFFING',
    severity: 'HIGH',
    title: 'Peak Evening Understaffing (6 PM - 9 PM)',
    recommendation: 'SLA compliance drops to 86.8% between 6 PM and 9 PM due to dinner influx. Deploy 2 additional floating pickers during the evening peak window.',
    projectedSlaImpact: '+3.8% SLA recovery',
    impactScore: 92,
  },
  {
    id: 'INS-02',
    category: 'AISLE_BOTTLENECK',
    severity: 'HIGH',
    title: 'Aisle 2 (Fruits & Vegetables) Pick Congestion',
    recommendation: 'Aisle 2 accounts for 34% of pick duration latency. Pre-weigh and pre-bag high-frequency items (Tomatoes, Onions, Bananas) in 500g/1kg pouches during morning prep.',
    projectedSlaImpact: '-35s pick latency per order',
    impactScore: 88,
  },
  {
    id: 'INS-03',
    category: 'DISPATCH',
    severity: 'MEDIUM',
    title: 'Packing Station Queue Forming',
    recommendation: 'Packing station dwell time exceeds 90 seconds during rush hours. Implement parallel bagging barcodes and dedicate 1 runner to dispatch staging.',
    projectedSlaImpact: '+2.1% SLA compliance',
    impactScore: 78,
  },
  {
    id: 'INS-04',
    category: 'INVENTORY',
    severity: 'HIGH',
    title: 'High-Demand SKUs Below Reorder Threshold',
    recommendation: 'Amul Taaza Milk and Hybrid Tomatoes are causing customer substitution delays (avg 180s per event). Trigger urgent supplier replenishment transfer.',
    projectedSlaImpact: '-14% substitution delays',
    impactScore: 84,
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    alertId: 'ALT-1001',
    type: 'SLA_RISK',
    severity: 'CRITICAL',
    storeId: 'BLR-KOR-01',
    message: 'Aisle 2 (Fruits & Veg) pick latency elevated by 45%. 6 orders at risk of breaching 10m SLA.',
    metadata: { aisle: 'Aisle 2', ordersAtRisk: 6 },
    resolved: false,
    createdAt: new Date().toISOString(),
  },
  {
    alertId: 'ALT-1002',
    type: 'SURGE',
    severity: 'HIGH',
    storeId: 'MUM-AND-03',
    message: 'Sudden rain in Andheri West: order intake surged 180% in last 15 minutes. Dispatch queue forming.',
    metadata: { intakeRpm: 42, threshold: 25 },
    resolved: false,
    createdAt: new Date().toISOString(),
  },
  {
    alertId: 'ALT-1003',
    type: 'LOW_STOCK',
    severity: 'MEDIUM',
    storeId: 'DEL-IND-02',
    message: 'Amul Taaza Milk 500ml stock dropped to 8 units (reorder level: 20). High substitution risk.',
    metadata: { sku: 'SKU-1001', currentStock: 8, reorderLevel: 20 },
    resolved: false,
    createdAt: new Date().toISOString(),
  },
  {
    alertId: 'ALT-1004',
    type: 'PICKER_SHORTAGE',
    severity: 'HIGH',
    storeId: 'GGN-SEC-04',
    message: 'Evening shift understaffed: 2 pickers absent. Ratio is 18 orders/picker/hr vs optimal 12.',
    metadata: { activePickers: 8, requiredPickers: 10 },
    resolved: false,
    createdAt: new Date().toISOString(),
  },
];

export const generateMockOrders = (count = 15): Order[] => {
  const causes = ['NONE', 'NONE', 'NONE', 'SLOW_PICK', 'PACKING_QUEUE', 'RIDER_WAIT', 'STOCKOUT_SUBSTITUTION'];
  return Array.from({ length: count }, (_, idx) => {
    const isBreached = idx % 5 === 0;
    const cause = isBreached ? causes[3 + (idx % 4)] : 'NONE';
    const pick = isBreached ? 230 : 150 + (idx % 20);
    const pack = isBreached ? 75 : 42;
    const handover = isBreached ? 80 : 38;
    const ride = isBreached ? 260 : 185;
    const assign = 20;
    const total = assign + pick + pack + handover + ride;

    return {
      _id: `ord-${1000 + idx}`,
      orderId: `BLK-BLR-${104200 + idx}`,
      storeId: 'BLR-KOR-01',
      items: [
        { sku: 'SKU-1001', name: 'Amul Taaza Toned Milk 500ml', qty: 2, price: 28, aisle: 'Aisle 1', rack: 'R-02' },
        { sku: 'SKU-1009', name: 'Hybrid Tomato 1kg', qty: 1, price: 42, aisle: 'Aisle 2', rack: 'R-04' },
        { sku: 'SKU-1017', name: "Lay's Magic Masala 50g", qty: 2, price: 20, aisle: 'Aisle 3', rack: 'R-01' },
      ],
      itemCount: 5,
      totalAmount: 138,
      placedAt: new Date(Date.now() - idx * 12 * 60 * 1000).toISOString(),
      status: 'delivered',
      delayReason: cause,
      isBreached,
      totalDurationSeconds: total,
      stageDurations: { assign, pick, pack, handover, ride },
      pickerId: 'PKR-0001',
      riderId: 'RDR-0004',
      substitutions: isBreached && cause === 'STOCKOUT_SUBSTITUTION' ? [
        { originalSku: 'SKU-1009', substituteSku: 'SKU-1011', reason: 'Out of stock in rack', approvedByCustomer: true, delaySeconds: 150 }
      ] : [],
      aisleSpreadCount: 3,
    };
  });
};
