# Blinkit Dark Store Fulfillment Analyzer - System Architecture

## 1. High-Level Architecture Overview

The platform uses a modular decoupled architecture designed for high throughput quick-commerce telemetry (10-minute delivery SLA).

```mermaid
graph TB
    subgraph Client ["Client Layer (React 18 + Vite + TS)"]
        UI["Ops Dashboard UI"]
        FunnelView["Stage Funnel & Heatmap"]
        OrderExp["Order Explorer & Import"]
        PredictView["Delay AI & What-If Simulator"]
        SocketClient["Socket.IO Live Feed"]
    end

    subgraph API_Gateway ["Backend Server (Node.js + Express + TS)"]
        Routes["API Routes (/api/v1/...)"]
        AuthMiddleware["JWT & RBAC Middleware"]
        Controllers["Controllers (No business logic)"]
        Services["Domain Services"]
        Cache["In-Memory 60s Cache"]
        Repos["Mongoose Repositories"]
        SocketServer["Socket.IO Realtime Gateway"]
    end

    subgraph Storage ["Database & Storage"]
        MongoDB[("MongoDB Atlas / In-Memory Mongo")]
    end

    subgraph ML_Microservice ["Prediction Microservice (Python FastAPI)"]
        FastAPI["FastAPI REST Server (:8000)"]
        ScikitLearn["Scikit-Learn Classifier (Random Forest + Logit)"]
        ModelArtifact["model.joblib"]
    end

    UI --> Routes
    SocketClient <--> SocketServer
    Routes --> AuthMiddleware --> Controllers --> Services
    Services <--> Cache
    Services --> Repos --> MongoDB
    Services -->|HTTP POST /predict/delay| FastAPI
    FastAPI --> ScikitLearn --> ModelArtifact
```

---

## 2. 10-Minute Order Telemetry Lifecycle Pipeline

In quick-commerce fulfillment, every second is instrumented across 5 distinct milestones:

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant OrderSystem as Order Ingestion
    participant Picker as Dark Store Picker
    participant PackingStation as QC & Bagging Bench
    participant DispatchBay as Staging & Rider Bay
    participant Rider as Delivery Rider

    Customer->>OrderSystem: Places Order (T=0s)
    OrderSystem->>Picker: Auto-Assigns Nearest Picker (Target: <25s)
    Note over Picker: Stage 1: Assign Duration

    Picker->>Picker: Walks Aisles, Scans SKUs into Cart (Target: <180s)
    Note over Picker: Stage 2: Pick Duration (Depends on Aisle Spread & Congestion)

    Picker->>PackingStation: Delivers cart to Bagging Bench
    PackingStation->>PackingStation: Scans barcodes, seals tamper-proof bag (Target: <50s)
    Note over PackingStation: Stage 3: Pack / QC Duration

    PackingStation->>DispatchBay: Transfers to numbered dispatch bin
    DispatchBay->>Rider: Rider OTP scan & bag handover (Target: <45s)
    Note over DispatchBay: Stage 4: Handover Duration

    Rider->>Customer: Electric bike transit to doorstep (Target: <240s)
    Note over Rider: Stage 5: Transit Ride Duration

    Rider-->>OrderSystem: Delivered confirmation (Total <= 600s / 10 mins)
```

---

## 3. Data Flow & Aggregation Pipelines

- **No Heavy In-Browser Stats**: All percentile calculations (P90), breach breakdowns, hourly demand profiles, and aisle heatmaps are computed in MongoDB Aggregation Pipelines on indexed fields:
  - `{ storeId: 1, placedAt: -1 }`
  - `{ storeId: 1, isBreached: 1, placedAt: -1 }`
  - `{ placedAt: -1, isBreached: 1 }`
- **60-Second TTL In-Memory Cache**: Heavy aggregate endpoints (`/analytics/overview`, `/analytics/stage-breakdown`, `/analytics/root-causes`) cache responses for 60 seconds.
- **Fail-Safe Delay Prediction**:
  1. Node backend attempts to call Python FastAPI microservice at `:8000/predict/delay`.
  2. If Python service is offline, backend seamlessly falls back to an embedded calibrated logistic engine with identical feature weights and returns SLA probability, risk tier, and model metrics.
