import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { port, jwtSecret } from "./config.js";
import db from "./models/index.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import callsRoute from "./routes/callsRoute.js";
import webhookRoute from "./routes/webhookRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { seedAdmin } from "./services/adminService.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(origin => origin)
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      // In production, be more strict - only allow if explicitly configured
      if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
        return callback(new Error('Origin required in production'));
      }
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, log the blocked origin for debugging
    console.warn(`CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

if (process.env.NODE_ENV === 'production' && (!jwtSecret || jwtSecret === "your-secret-key-change-in-production")) {
  console.error("❌ CRITICAL: JWT_SECRET must be set in production environment!");
  process.exit(1);
}

app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/api", callsRoute);
app.use("/api", bookingRoute);
app.use("/webhooks", webhookRoute);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

// Main server startup function - connects to database, syncs models, seeds admin, starts server
async function start() {
  try {
    console.log("🔌 Connecting to database...");
    await db.sequelize.authenticate();
    console.log("✅ Database connection established");

    console.log("🔄 Syncing database models...");
    await db.sequelize.sync({ alter: false });
    console.log("✅ Database models synced");

    await seedAdmin();

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
