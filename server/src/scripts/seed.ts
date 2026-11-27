import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { logger } from '../config/logger.js';
import { DarkStore } from '../models/DarkStore.js';
import { Product, IProduct } from '../models/Product.js';
import { Picker } from '../models/Picker.js';
import { Rider } from '../models/Rider.js';
import { User } from '../models/User.js';
import { Order, IOrder, DelayReason } from '../models/Order.js';
import { Alert } from '../models/Alert.js';

// Random helpers
const randomChoice = <T>(arr: readonly T[] | T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min;

// Log-normal random number generator for realistic fulfillment times
const randomLogNormal = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return Math.exp(mean + stdDev * z0);
};

export const seedData = async (force = false, totalOrdersToGenerate = 10000) => {
  logger.info('Connecting to database for seeding...');
  await connectDB();

  const existingStores = await DarkStore.countDocuments();
  if (existingStores > 0 && !force) {
    const existingOrders = await Order.countDocuments();
    logger.info(`Database already seeded with ${existingStores} stores and ${existingOrders} orders. Use force=true to re-seed.`);
    return;
  }

  logger.info('Purging existing data...');
  await Promise.all([
    DarkStore.deleteMany({}),
    Product.deleteMany({}),
    Picker.deleteMany({}),
    Rider.deleteMany({}),
    User.deleteMany({}),
    Order.deleteMany({}),
    Alert.deleteMany({}),
  ]);

  // 1. Seed Dark Stores
  logger.info('Seeding 5 Dark Stores...');
  const stores = [
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
  await DarkStore.insertMany(stores);

  // 2. Seed Users with hashed passwords
  logger.info('Seeding User accounts (Admin, Store Managers, Analyst)...');
  const passwordHash = await bcrypt.hash('Blinkit@123', 10);
  const users = [
    {
      name: 'Aarav Sharma (Ops Head)',
      email: 'admin@blinkit.com',
      passwordHash,
      role: 'ADMIN',
    },
    {
      name: 'Priya Sundaram (Manager BLR)',
      email: 'manager.blr@blinkit.com',
      passwordHash,
      role: 'MANAGER',
      storeId: 'BLR-KOR-01',
    },
    {
      name: 'Rohit Verma (Manager DEL)',
      email: 'manager.del@blinkit.com',
      passwordHash,
      role: 'MANAGER',
      storeId: 'DEL-IND-02',
    },
    {
      name: 'Ananya Iyer (Analyst)',
      email: 'analyst@blinkit.com',
      passwordHash,
      role: 'ANALYST',
    },
  ];
  await User.insertMany(users);

  // 3. Seed 300 SKUs
  logger.info('Generating 300 Products across 8 Aisles...');
  const categories = [
    { name: 'Dairy & Breakfast', aisle: 'Aisle 1', avgSec: 18 },
    { name: 'Fruits & Vegetables', aisle: 'Aisle 2', avgSec: 32 },
    { name: 'Snacks & Munchies', aisle: 'Aisle 3', avgSec: 20 },
    { name: 'Beverages & Soft Drinks', aisle: 'Aisle 4', avgSec: 26 },
    { name: 'Instant Food & Noodles', aisle: 'Aisle 5', avgSec: 22 },
    { name: 'Bakery & Biscuits', aisle: 'Aisle 6', avgSec: 19 },
    { name: 'Personal Care & Hygiene', aisle: 'Aisle 7', avgSec: 28 },
    { name: 'Household & Cleaning', aisle: 'Aisle 8', avgSec: 35 },
  ];

  const productTemplates = [
    // Dairy
    { name: 'Amul Taaza Toned Fresh Milk 500ml', catIdx: 0, price: 28, weight: 510 },
    { name: 'Amul Butter Salted 100g', catIdx: 0, price: 58, weight: 100 },
    { name: 'Mother Dairy Classic Curd 400g', catIdx: 0, price: 35, weight: 400 },
    { name: 'Nandini Malai Paneer 200g', catIdx: 0, price: 95, weight: 200 },
    { name: 'Modern Brown Bread 400g', catIdx: 0, price: 50, weight: 400 },
    { name: 'Farm Fresh White Eggs 6 Pcs', catIdx: 0, price: 54, weight: 350 },
    { name: 'Milky Mist Greek Yogurt Blueberry 100g', catIdx: 0, price: 45, weight: 100 },
    { name: 'Epigamia Strawberry Greek Yogurt 90g', catIdx: 0, price: 50, weight: 90 },
    // Fruits & Veg
    { name: 'Hybrid Tomato 1kg', catIdx: 1, price: 42, weight: 1000 },
    { name: 'Red Onion Fresh 1kg', catIdx: 1, price: 65, weight: 1000 },
    { name: 'Baby Potato Fresh 1kg', catIdx: 1, price: 38, weight: 1000 },
    { name: 'Fresh Coriander Bunch 100g', catIdx: 1, price: 15, weight: 100 },
    { name: 'Robusta Banana 500g (3-4 pcs)', catIdx: 1, price: 35, weight: 500 },
    { name: 'Royal Gala Apple 4 pcs', catIdx: 1, price: 140, weight: 600 },
    { name: 'Green Bell Pepper Capsicum 500g', catIdx: 1, price: 45, weight: 500 },
    { name: 'Palak Spinach Cleaned 250g', catIdx: 1, price: 25, weight: 250 },
    // Snacks
    { name: "Lay's India's Magic Masala Potato Chips 50g", catIdx: 2, price: 20, weight: 50 },
    { name: 'Kurkure Masala Munch Crisps 85g', catIdx: 2, price: 20, weight: 85 },
    { name: 'Haldiram Nagpur Aloo Bhujia 200g', catIdx: 2, price: 62, weight: 200 },
    { name: 'Doritos Cheese Supreme Nacho Chips 60g', catIdx: 2, price: 30, weight: 60 },
    { name: 'Act II Golden Sizzle Butter Popcorn 60g', catIdx: 2, price: 35, weight: 60 },
    { name: 'Pringles Sour Cream & Onion 107g', catIdx: 2, price: 120, weight: 107 },
    { name: 'Bingo Mad Angles Achaari Masti 66g', catIdx: 2, price: 20, weight: 66 },
    // Beverages
    { name: 'Coca-Cola Zero Sugar Can 300ml', catIdx: 3, price: 40, weight: 320 },
    { name: 'Thums Up Charged 250ml Bottle', catIdx: 3, price: 20, weight: 260 },
    { name: 'Red Bull Energy Drink Can 250ml', catIdx: 3, price: 125, weight: 270 },
    { name: 'Real Mixed Fruit Juice 1L', catIdx: 3, price: 130, weight: 1050 },
    { name: 'Frooti Fresh Mango Drink 160ml', catIdx: 3, price: 15, weight: 170 },
    { name: 'Kinley Sparkling Soda 750ml', catIdx: 3, price: 20, weight: 770 },
    { name: 'Paper Boat Aamras Juice 200ml', catIdx: 3, price: 35, weight: 210 },
    // Instant Food
    { name: 'Maggi 2-Minute Masala Instant Noodles 70g', catIdx: 4, price: 14, weight: 70 },
    { name: 'Yippee Magic Masala Noodles 240g Pack of 4', catIdx: 4, price: 55, weight: 240 },
    { name: 'Kissan Fresh Tomato Ketchup 950g', catIdx: 4, price: 135, weight: 980 },
    { name: 'Bambino Macaroni Pasta 400g', catIdx: 4, price: 48, weight: 400 },
    { name: 'Nutella Hazelnut Cocoa Spread 350g', catIdx: 4, price: 390, weight: 350 },
    { name: 'Pintola All-Natural Peanut Butter Crunchy 350g', catIdx: 4, price: 199, weight: 350 },
    // Bakery
    { name: 'Britannia Good Day Butter Cookies 100g', catIdx: 5, price: 30, weight: 100 },
    { name: 'Parle-G Gold Glucose Biscuits 1kg', catIdx: 5, price: 110, weight: 1000 },
    { name: 'Oreo Vanilla Crème Sandwich Biscuits 120g', catIdx: 5, price: 35, weight: 120 },
    { name: 'Britannia Cake Chocolate 45g', catIdx: 5, price: 20, weight: 45 },
    { name: 'Sunfeast Dark Fantasy Choco Fills 75g', catIdx: 5, price: 40, weight: 75 },
    // Personal Care
    { name: 'Dettol Original Germ Protection Bathing Soap 75g', catIdx: 6, price: 42, weight: 75 },
    { name: 'Colgate Strong Teeth Dental Cream 200g', catIdx: 6, price: 115, weight: 200 },
    { name: 'Dove Daily Shine Shampoo 180ml', catIdx: 6, price: 185, weight: 200 },
    { name: 'Nivea Soft Light Moisturizing Cream 100ml', catIdx: 6, price: 190, weight: 100 },
    { name: 'Gillette Mach 3 Razor Cartridges 2s', catIdx: 6, price: 340, weight: 50 },
    // Household
    { name: 'Vim Dishwash Gel Lemon 500ml Bottle', catIdx: 7, price: 115, weight: 550 },
    { name: 'Ariel Matic Front Load Detergent Powder 1kg', catIdx: 7, price: 285, weight: 1000 },
    { name: 'Harpic Power Plus Disinfectant Toilet Cleaner 500ml', catIdx: 7, price: 99, weight: 550 },
    { name: 'Colin Glass Cleaner Spray 500ml', catIdx: 7, price: 110, weight: 530 },
    { name: 'Shalimar Super Bio-Degradable Garbage Bags Medium 30s', catIdx: 7, price: 95, weight: 150 },
  ];

  const productsData: Partial<IProduct>[] = [];
  let skuCounter = 1001;

  const brands = ['Amul', 'Nestle', 'Britannia', 'Tata', 'Dabur', 'HUL', 'ITC', 'Cadbury', 'P&G', 'Haldiram'];
  const variants = ['Regular', 'Supreme', 'Zero', 'Organic', 'Crunchy', 'Extra Large', 'Saver Pack', 'Twin Pack'];

  for (let i = 0; i < 300; i++) {
    const template = productTemplates[i % productTemplates.length];
    const cat = categories[template.catIdx];
    const isBase = i < productTemplates.length;
    const name = isBase
      ? template.name
      : `${randomChoice(brands)} ${cat.name.split(' ')[0]} ${randomChoice(variants)} ${randomInt(100, 500)}g`;
    const sku = `SKU-${skuCounter++}`;
    const rack = `R-${String(randomInt(1, 10)).padStart(2, '0')}`;
    const stock = randomInt(5, 120);
    const reorderLevel = randomInt(15, 25);
    const unitPrice = isBase ? template.price : randomInt(20, 450);
    const weightGrams = isBase ? template.weight : randomInt(50, 1000);
    const avgPickSeconds = cat.avgSec + randomInt(-4, 8);

    productsData.push({
      sku,
      name,
      category: cat.name,
      aisle: cat.aisle,
      rack,
      stock,
      reorderLevel,
      avgPickSeconds,
      unitPrice,
      weightGrams,
      isPopular: i % 4 === 0,
    });
  }

  for (let i = 0; i < productsData.length; i++) {
    if (i % 6 === 0) {
      const altIdx = (i + 1) % productsData.length;
      productsData[i].substitutionSku = productsData[altIdx].sku;
    }
  }

  const createdProducts = await Product.insertMany(productsData);

  // 4. Seed Pickers and Riders across stores
  logger.info('Seeding Pickers and Riders for each Dark Store...');
  const pickersList: any[] = [];
  const ridersList: any[] = [];
  const shifts = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'] as const;
  const experienceLevels = ['JUNIOR', 'MID', 'SENIOR'] as const;

  const indianNames = [
    'Ramesh Kumar', 'Suresh Nair', 'Vikram Singh', 'Manoj Patil', 'Deepak Joshi',
    'Sunil Yadav', 'Rajesh Gupta', 'Karan Mehta', 'Ankit Sharma', 'Santosh Das',
    'Mohan Lal', 'Vinod Reddy', 'Gaurav Dubey', 'Pradeep Mondal', 'Sanjay Rawat',
    'Arjun Maurya', 'Naveen Rao', 'Brijesh Pandey', 'Rohan Bhat', 'Pankaj Tiwari',
  ];

  let pickerIdx = 1;
  let riderIdx = 1;

  for (const s of stores) {
    for (let p = 0; p < s.pickerCount; p++) {
      const exp = randomChoice(experienceLevels);
      const months = exp === 'JUNIOR' ? randomInt(1, 6) : exp === 'MID' ? randomInt(7, 24) : randomInt(25, 60);
      pickersList.push({
        pickerId: `PKR-${String(pickerIdx++).padStart(4, '0')}`,
        name: `${randomChoice(indianNames)} (${s.storeId.split('-')[0]})`,
        storeId: s.storeId,
        shift: shifts[p % shifts.length],
        experienceLevel: exp,
        experienceMonths: months,
        rating: Number(randomFloat(4.4, 4.95).toFixed(2)),
        active: true,
      });
    }

    for (let r = 0; r < s.riderCount; r++) {
      ridersList.push({
        riderId: `RDR-${String(riderIdx++).padStart(4, '0')}`,
        name: `${randomChoice(indianNames)} (Rider)`,
        storeId: s.storeId,
        avgHandoverSeconds: randomInt(35, 65),
        vehicleType: randomChoice(['EV_BIKE', 'PETROL_BIKE', 'CYCLE']),
        rating: Number(randomFloat(4.6, 5.0).toFixed(2)),
        active: true,
      });
    }
  }

  await Picker.insertMany(pickersList);
  await Rider.insertMany(ridersList);

  // 5. Seed Orders (10,000 realistic orders across 30 days)
  logger.info(`Simulating ~${totalOrdersToGenerate} realistic orders over the past 30 days...`);
  const ordersBatch: Partial<IOrder>[] = [];
  const now = new Date();
  const rainDays = [3, 11, 22];

  for (let i = 0; i < totalOrdersToGenerate; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const isRainDay = rainDays.includes(daysAgo);

    let hour: number;
    const randHourType = Math.random();
    if (randHourType < 0.28) {
      hour = randomInt(8, 10);
    } else if (randHourType < 0.65) {
      hour = randomInt(18, 22);
    } else if (randHourType < 0.90) {
      hour = randomInt(11, 17);
    } else {
      hour = randomInt(6, 7);
    }

    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);
    const placedDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    placedDate.setHours(hour, minute, second, 0);

    const store = randomChoice(stores);
    const storePickers = pickersList.filter((p) => p.storeId === store.storeId);
    const storeRiders = ridersList.filter((r) => r.storeId === store.storeId);
    const picker = randomChoice(storePickers);
    const rider = randomChoice(storeRiders);

    const itemCount = randomInt(2, 7);
    const orderItems: any[] = [];
    const usedAisles = new Set<string>();
    let totalAmount = 0;

    for (let itemIdx = 0; itemIdx < itemCount; itemIdx++) {
      const prod = randomChoice(createdProducts);
      const qty = randomInt(1, 3);
      const aisle = prod.aisle || 'Aisle 1';
      const unitPrice = prod.unitPrice || 50;

      orderItems.push({
        sku: prod.sku,
        name: prod.name,
        qty,
        price: unitPrice,
        aisle,
        rack: prod.rack,
      });
      usedAisles.add(aisle);
      totalAmount += unitPrice * qty;
    }

    const aisleSpreadCount = usedAisles.size;
    const expFactor = picker.experienceLevel === 'JUNIOR' ? 1.25 : picker.experienceLevel === 'SENIOR' ? 0.85 : 1.0;
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 22);
    const congestionFactor = isPeakHour ? 1.2 : 1.0;

    const willBreach = Math.random() < 0.10;

    let assignSec = Math.round(randomLogNormal(2.8, 0.25));
    let pickSec = Math.round(
      (itemCount * 14 + aisleSpreadCount * 18 + randomInt(40, 70)) * expFactor * congestionFactor
    );
    let packSec = Math.round(randomLogNormal(3.6, 0.3));
    let handoverSec = Math.round(rider.avgHandoverSeconds + randomInt(-10, 15));
    let rideSec = Math.round(randomLogNormal(5.2, 0.25));

    let delayReason: DelayReason = 'NONE';
    const substitutions: any[] = [];

    if (willBreach) {
      const reasonRoll = Math.random();
      if (reasonRoll < 0.32) {
        delayReason = 'SLOW_PICK';
        pickSec += randomInt(150, 300);
      } else if (reasonRoll < 0.54) {
        delayReason = 'PACKING_QUEUE';
        packSec += randomInt(140, 260);
      } else if (reasonRoll < 0.74) {
        delayReason = 'RIDER_WAIT';
        handoverSec += randomInt(160, 300);
      } else if (reasonRoll < 0.88) {
        delayReason = 'STOCKOUT_SUBSTITUTION';
        const subProd = orderItems[0];
        const subDelay = randomInt(120, 240);
        substitutions.push({
          originalSku: subProd.sku,
          substituteSku: 'SKU-SUB-' + randomInt(100, 999),
          reason: 'Out of stock in rack',
          approvedByCustomer: true,
          delaySeconds: subDelay,
        });
        pickSec += subDelay;
      } else {
        delayReason = 'TRAFFIC_RAIN';
        rideSec += randomInt(200, 400);
      }
    }

    const totalDurationSeconds = assignSec + pickSec + packSec + handoverSec + rideSec;
    const isBreached = totalDurationSeconds > 600;

    const assignedAt = new Date(placedDate.getTime() + assignSec * 1000);
    const pickStartAt = assignedAt;
    const pickEndAt = new Date(pickStartAt.getTime() + pickSec * 1000);
    const packedAt = new Date(pickEndAt.getTime() + packSec * 1000);
    const dispatchedAt = new Date(packedAt.getTime() + handoverSec * 1000);
    const deliveredAt = new Date(dispatchedAt.getTime() + rideSec * 1000);

    const orderId = `BLK-${store.storeId.split('-')[0]}-${String(100000 + i)}`;

    ordersBatch.push({
      orderId,
      storeId: store.storeId,
      items: orderItems,
      itemCount,
      totalAmount,
      placedAt: placedDate,
      assignedAt,
      pickStartAt,
      pickEndAt,
      packedAt,
      dispatchedAt,
      deliveredAt,
      status: 'delivered',
      delayReason: isBreached ? (delayReason === 'NONE' ? 'SLOW_PICK' : delayReason) : 'NONE',
      isBreached,
      totalDurationSeconds,
      stageDurations: {
        assign: assignSec,
        pick: pickSec,
        pack: packSec,
        handover: handoverSec,
        ride: rideSec,
      },
      pickerId: picker.pickerId,
      riderId: rider.riderId,
      substitutions,
      aisleSpreadCount,
      weatherCondition: isRainDay ? 'RAIN' : 'CLEAR',
    });
  }

  logger.info(`Inserting ${ordersBatch.length} orders in chunks...`);
  const chunkSize = 2000;
  for (let c = 0; c < ordersBatch.length; c += chunkSize) {
    const chunk = ordersBatch.slice(c, c + chunkSize);
    await Order.insertMany(chunk, { ordered: false });
    logger.info(`Inserted batch ${c + chunk.length}/${ordersBatch.length}`);
  }

  // 6. Seed Realistic Operational Alerts
  logger.info('Seeding Operational Alerts...');
  const alertsData = [
    {
      alertId: 'ALT-1001',
      type: 'SLA_RISK',
      severity: 'CRITICAL',
      storeId: 'BLR-KOR-01',
      message: 'Aisle 2 (Fruits & Veg) pick latency elevated by 45%. 6 orders at risk of breaching 10m SLA.',
      metadata: { aisle: 'Aisle 2', ordersAtRisk: 6 },
      resolved: false,
    },
    {
      alertId: 'ALT-1002',
      type: 'SURGE',
      severity: 'HIGH',
      storeId: 'MUM-AND-03',
      message: 'Sudden rain in Andheri West: order intake surged 180% in last 15 minutes. Dispatch queue forming.',
      metadata: { intakeRpm: 42, threshold: 25 },
      resolved: false,
    },
    {
      alertId: 'ALT-1003',
      type: 'LOW_STOCK',
      severity: 'MEDIUM',
      storeId: 'DEL-IND-02',
      message: 'Amul Taaza Milk 500ml stock dropped to 8 units (reorder level: 20). High substitution risk.',
      metadata: { sku: 'SKU-1001', currentStock: 8, reorderLevel: 20 },
      resolved: false,
    },
    {
      alertId: 'ALT-1004',
      type: 'PICKER_SHORTAGE',
      severity: 'HIGH',
      storeId: 'GGN-SEC-04',
      message: 'Evening shift understaffed: 2 pickers absent. Ratio is 18 orders/picker/hr vs optimal 12.',
      metadata: { activePickers: 8, requiredPickers: 10 },
      resolved: false,
    },
    {
      alertId: 'ALT-1005',
      type: 'SLA_RISK',
      severity: 'MEDIUM',
      storeId: 'HYD-HIT-05',
      message: 'Rider handover queue averaging 92s (benchmark 45s). Bottleneck at dispatch bay 3.',
      metadata: { avgHandover: 92, bay: 3 },
      resolved: true,
      resolvedAt: new Date(Date.now() - 3600000),
      resolvedBy: 'Aarav Sharma',
    },
  ];
  await Alert.insertMany(alertsData);

  logger.info('Seeding successfully completed!');
  const finalCounts = {
    stores: await DarkStore.countDocuments(),
    products: await Product.countDocuments(),
    pickers: await Picker.countDocuments(),
    riders: await Rider.countDocuments(),
    orders: await Order.countDocuments(),
    alerts: await Alert.countDocuments(),
    users: await User.countDocuments(),
  };
  logger.info({ finalCounts }, 'Database summary');
};

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedData(true)
    .then(async () => {
      logger.info('Seed process finished. Exiting.');
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      logger.error({ err }, 'Seed failed');
      await disconnectDB();
      process.exit(1);
    });
}
