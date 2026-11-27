# 🚀 Deploying Blinkit Dark Store Analyzer on Vercel & Render

This guide outlines the production deployment of the **Blinkit Dark Store Fulfillment Analyzer**:
1. **Frontend**: Deployed on **Vercel** (Global Edge CDN, auto-SSL, instant preview URLs)
2. **Backend**: Deployed on **Render** / **Railway** (Node.js runtime with WebSockets & Mongoose)
3. **Database**: **MongoDB Atlas** (Free M0 Cluster)

---

## Part 1: Deploying the Frontend on Vercel (3 Steps)

### Method 1: Using the Vercel Web Dashboard (Recommended)

1. **Go to Vercel**: Visit [https://vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. **Import Repository**:
   - Select `Sejalsoni30/Blinkit` from your repositories.
3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client`** (or leave root since `vercel.json` is provided).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables** (Optional, if backend is already deployed):
   - `VITE_API_URL`: `https://<YOUR-RENDER-BACKEND-URL>/api/v1`
   - `VITE_SOCKET_URL`: `https://<YOUR-RENDER-BACKEND-URL>`
5. Click **Deploy**. Vercel will build and assign your live domain (e.g. `https://blinkit-fulfillment.vercel.app`).

---

### Method 2: Using the Vercel CLI

If you have Node.js installed, you can deploy in one command:
```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Deploy from the client directory
cd client
vercel

# 3. Deploy to production
vercel --prod
```

---

## Part 2: Deploying the Backend on Render (Free Web Service)

Since the frontend on Vercel needs to call the REST APIs and connect to Socket.IO, deploy the `/server` on Render:

1. Go to [https://render.com](https://render.com) and click **New + $\rightarrow$ Web Service**.
2. Connect your GitHub repository: `https://github.com/Sejalsoni30/Blinkit.git`.
3. Configure the settings:
   - **Name**: `blinkit-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
4. **Add Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: Your MongoDB Atlas URI (`mongodb+srv://...`)
   - `JWT_SECRET`: `blinkit-dark-store-super-secret-jwt-key-2026`
   - `JWT_REFRESH_SECRET`: `blinkit-dark-store-refresh-secret-jwt-key-2026`
   - `CORS_ORIGIN`: Your Vercel frontend URL (e.g. `https://blinkit-fulfillment.vercel.app`)
5. Click **Create Web Service**.
6. Once deployed, copy your Render URL and add it to your Vercel project's `VITE_API_URL` environment variable!

---

## Part 3: Free MongoDB Atlas Database Setup

1. Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user with username/password.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
5. Click **Connect** $\rightarrow$ **Drivers** $\rightarrow$ Copy the connection string into your Render `MONGODB_URI`.
6. On startup, the backend automatically seeds all 5 dark stores, 300 SKUs, and 10,000 orders!
