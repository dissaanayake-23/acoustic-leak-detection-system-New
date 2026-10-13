# Compressed Air Leak Detection - Backend & Railway PostgreSQL Setup

This backend powers the real-time acoustic compressed air leak detection dashboard. It connects to **PostgreSQL on Railway**, accepts sensor data from ESP32 with INMP441 microphones, and streams live telemetry via **WebSockets (Socket.io)**.

---

## 🚀 Features

- **PostgreSQL Database**: Compatible with Railway, Supabase, Neon, or local Postgres.
- **Auto Table Schema & Seeding**: Automatically creates `nodes`, `alerts`, `history`, `sensor_readings`, and `system_settings` tables on first run.
- **Real-Time WebSockets (Socket.io)**: Instant acoustic meter updates, leak detection events, and alert resolution broadcasts.
- **ESP32 & INMP441 Ingestion**: Dedicated endpoint (`POST /api/sensor/reading`) ready for microcontroller telemetry.
- **Fail-Safe In-Memory Fallback**: Runs out of the box even before `DATABASE_URL` is configured, preventing development crashes.
- **1-Click Railway Ready**: Includes `railway.json` and `Procfile`.

---

## 🗄️ Setting Up PostgreSQL on Railway (Step-by-Step)

### Step 1: Create PostgreSQL Database on Railway
1. Go to [railway.com](https://railway.com) and log in or create a free account.
2. Click **New Project** -> Select **Provision PostgreSQL**.
3. Railway will provision your database in seconds.
4. Click on the PostgreSQL box in your project -> Go to the **Variables** tab.
5. Copy the **`DATABASE_URL`** (it looks like: `postgresql://postgres:password@junction.proxy.rlwy.net:12345/railway`).

### Step 2: Configure Environment Variables
In `server/.env`, paste your database URL:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@junction.proxy.rlwy.net:12345/railway
CLIENT_URL=http://localhost:5173
ENABLE_SIMULATOR=true
```

### Step 3: Run the Backend Locally
```bash
# From workspace root:
npm run server

# Or inside the server folder:
cd server
npm run dev
```

The server will automatically:
1. Connect to Railway PostgreSQL.
2. Create all necessary tables (`nodes`, `alerts`, `history`, `sensor_readings`, `system_settings`).
3. Seed the initial 12 nodes and alert history.
4. Start WebSockets on port `5000`.

---

## 🚢 Deploying Backend to Railway

1. In Railway, click **New** -> **GitHub Repo** -> select your repository.
2. In **Settings**:
   - Set **Root Directory** to `/server`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. In **Variables**:
   - Add `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` (or paste the connection string).
   - Add `PORT`: `5000` (or leave default).
4. Go to **Networking** -> click **Generate Domain** to get your public backend URL:
   `https://compressed-air-backend.up.railway.app`

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and database connection info |
| `GET` | `/api/nodes` | List all 12 monitoring nodes with leak status and dB |
| `GET` | `/api/nodes/:id` | Get single node status |
| `GET` | `/api/alerts` | List alerts (supports `?state=active` or `?state=resolved`) |
| `POST` | `/api/alerts` | Trigger a manual alert |
| `PATCH` | `/api/alerts/:id/resolve` | Resolve an active leak alert and clear node status |
| `GET` | `/api/history` | List detection history logs (`?node=Node 03`, `?status=leak`) |
| `GET` | `/api/sensor/latest` | Latest live sound level, threshold, and leak status |
| `POST` | `/api/sensor/reading` | **ESP32 Telemetry ingestion endpoint** |
| `GET` | `/api/sensor/device` | Hardware and gateway connection health |
| `POST` | `/api/sensor/threshold` | Update global acoustic threshold |

---

## 🔌 ESP32 + INMP441 Firmware

The Arduino C++ sketch is available in:
📁 `firmware/esp32_leak_detector.ino`

### Pin Connections:
- `INMP441 SCK` -> `ESP32 GPIO 14`
- `INMP441 WS`  -> `ESP32 GPIO 15`
- `INMP441 SD`  -> `ESP32 GPIO 32`
- `INMP441 L/R` -> `GND`
- `INMP441 VDD` -> `3.3V`
- `INMP441 GND` -> `GND`

In the sketch:
1. Enter your Wi-Fi SSID and password.
2. Set `BACKEND_URL` to your Railway domain:
   ```cpp
   const char* BACKEND_URL = "https://your-railway-app.up.railway.app/api/sensor/reading";
   ```
3. Flash the code to your ESP32. It will continuously sample the INMP441 microphone and send ultrasonic acoustic readings to the backend!

---

## 🇱🇰 සිංහල උපදෙස් (Sinhala Guide)

1. **Railway එකේ Postgres Database එකක් හදන්න:**
   - [railway.com](https://railway.com) ගිහින් `New Project` -> `Provision PostgreSQL` දෙන්න.
   - Database එක හැදුනම `Variables` වල තියෙන **`DATABASE_URL`** එක copy කරගන්න.

2. **Backend එකට Database එක සම්බන්ධ කිරීම:**
   - `server/.env` file එක open කරලා `DATABASE_URL=` ඉදිරියෙන් copy කරගත් URL එක paste කරන්න.
   - Terminal එකේ `npm run server` run කරන්න. Tables සහ initial data ඔක්කොම automatically create වෙනවා.

3. **Frontend සහ Backend එකට run කිරීම:**
   - Frontend: `npm run dev`
   - Backend: `npm run server`
   - Dashboard එකේ sidebar එකෙන් "Backend Online / Railway & Sockets Active" indicator එක බලාගන්න පුළුවන්.

4. **ESP32 එක සම්බන්ධ කිරීම:**
   - `firmware/esp32_leak_detector.ino` file එක Arduino IDE එකෙන් open කරලා Wi-Fi details සහ backend URL එක දාලා ESP32 එකට upload කරන්න.
