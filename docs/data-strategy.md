# Blinkit Dark Store Fulfillment Analyzer - Data Strategy & Simulation Engine

## 1. Context & Motivation
Because real-world dark store order logs contain proprietary merchant and consumer data, this application features a **stochastic simulation engine** that mirrors genuine Indian quick-commerce logistics patterns observed in platforms like Blinkit, Zepto, and Instamart.

---

## 2. Simulation Engine Specifications

The seed generator (`server/src/scripts/seed.ts`) populates:
1. **5 Dark Stores** in key metropolitan hubs:
   - `BLR-KOR-01`: Koramangala 4th Block Hub, Bengaluru (250 capacity, 15 pickers, 26 riders)
   - `DEL-IND-02`: Indirapuram Express Dark Store, Delhi NCR (220 capacity, 12 pickers, 20 riders)
   - `MUM-AND-03`: Andheri West Central Warehouse, Mumbai (280 capacity, 16 pickers, 28 riders)
   - `GGN-SEC-04`: Sector 29 Prime Fulfilment, Gurugram (200 capacity, 11 pickers, 18 riders)
   - `HYD-HIT-05`: Hitec City Fast-Hub, Hyderabad (240 capacity, 13 pickers, 22 riders)

2. **300 Products (SKUs)** across 8 aisles:
   - Dairy & Breakfast (Aisle 1)
   - Fruits & Vegetables (Aisle 2 - High pick latency)
   - Snacks & Munchies (Aisle 3)
   - Beverages & Soft Drinks (Aisle 4)
   - Instant Food & Noodles (Aisle 5)
   - Bakery & Biscuits (Aisle 6)
   - Personal Care & Hygiene (Aisle 7)
   - Household & Cleaning (Aisle 8)

3. **10,000 Realistic Orders over 30 Days**:
   - **Peak Hour Weighting**: Order generation is heavily weighted around morning rush (8:00 AM - 10:00 AM) and evening prime time (6:00 PM - 10:00 PM).
   - **Log-Normal Stage Durations**:
     - Assign time: $LN(2.8, 0.25)$ ~ 16s - 25s
     - Pick time: $(ItemCount \times 14s + AisleSpread \times 18s + Base) \times ExpFactor \times CongestionFactor$
     - Pack time: $LN(3.6, 0.3)$ ~ 35s - 50s
     - Handover: $RiderAvg \pm 15s$
     - Transit Ride: $LN(5.2, 0.25)$ ~ 160s - 220s
   - **8% - 12% SLA Breaches** with tagged cause factors:
     - `SLOW_PICK`: Excessive item spread or junior picker unfamiliarity
     - `PACKING_QUEUE`: Packing station congestion during surges
     - `RIDER_WAIT`: Dispatch bay bottleneck or rider shortage
     - `STOCKOUT_SUBSTITUTION`: Out of stock item triggering replacement search & customer confirmation delay
     - `TRAFFIC_RAIN`: Severe weather downpour causing last-mile transit delays

---

## 3. CSV Import Format

Users can ingest real order telemetry via CSV upload. The accepted format:

```csv
orderId,storeId,itemCount,totalAmount,placedAt,assignDuration,pickDuration,packDuration,handoverDuration,rideDuration,delayReason,aisleSpread
BLK-CSV-9001,BLR-KOR-01,4,350,2026-11-20T10:30:00Z,22,145,40,35,170,NONE,2
BLK-CSV-9002,DEL-IND-02,7,820,2026-11-20T19:15:00Z,35,280,110,65,190,PACKING_QUEUE,4
```
