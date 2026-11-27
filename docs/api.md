# Blinkit Dark Store Analyzer - REST & Real-Time API Reference

## Base URL
`/api/v1`

Interactive OpenAPI / Swagger UI documentation is available at:
`http://localhost:5000/api/docs`

---

## 1. Authentication & Session Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticate user, returns access token and sets httpOnly cookies |
| `POST` | `/auth/refresh` | Public | Rotates refresh token and generates new 15m access token |
| `POST` | `/auth/logout` | Authenticated | Clears cookies and revokes refresh token |
| `GET` | `/auth/me` | Authenticated | Returns current authenticated user profile & role |

---

## 2. Fulfillment Analytics (MongoDB Aggregations)
All analytics endpoints support query parameters:
- `storeId`: `ALL` or specific dark store ID (e.g. `BLR-KOR-01`)
- `startDate`: ISO-8601 string
- `endDate`: ISO-8601 string

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/analytics/overview` | Authenticated | KPI metrics (% SLA compliance, breaches, avg delivery sec, trend vs prev period) |
| `GET` | `/analytics/stage-breakdown` | Authenticated | 5-stage funnel telemetry (Avg, P90, SLA target, bottleneck indicator) |
| `GET` | `/analytics/root-causes` | Authenticated | Pareto distribution of SLA breaches by cause with drill-down orders |
| `GET` | `/analytics/hourly-demand` | Authenticated | Hourly intake volume, breach count, and SLA compliance (00:00 - 23:00) |
| `GET` | `/analytics/aisle-heatmap` | Authenticated | 2D matrix of Aisle × Hour pick frequency & latency |
| `GET` | `/analytics/sku-pick-times` | Authenticated | Top 10 slowest SKUs to pick and correlation with order breaches |
| `GET` | `/analytics/store-comparison` | Admin / Analyst | Fleet leaderboard comparing all 5 dark stores |

---

## 3. Order Explorer & CSV Import
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/orders` | Authenticated | Paginated, sorted order list with search and filters |
| `GET` | `/orders/:orderId` | Authenticated | Full order lifecycle timeline, stage durations, picker, rider, items |
| `POST` | `/import/orders` | Admin / Manager | Ingest CSV order records (bulk upload) |
| `GET` | `/import/template` | Authenticated | Download sample CSV template |

---

## 4. Delay Prediction & What-If Simulation
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict/delay` | Predicts SLA breach probability for an incoming order |
| `POST` | `/predict/what-if` | Mathematical queuing simulation for picker count and surge changes |
| `GET` | `/predict/insights` | Plain-English prescriptive recommendations ranked by impact score |

---

## 5. WebSockets (Socket.IO)
- **Connection**: `ws://localhost:5000/socket.io`
- **Events Emitted by Server**:
  - `new_alert`: Broadcasts newly generated operational alerts in real time
  - `store_alert`: Targeted store room alert
  - `order_update`: Live order status telemetry updates
