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

// Log allowed origins on startup for debugging
console.log('CORS Configuration:');
console.log('  Allowed Origins:', allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'None configured');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'not set');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) {
      // In production, be more strict - only allow if explicitly configured
      if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
        console.warn('⚠️  CORS: No origin provided and no allowed origins configured in production');
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
    console.warn(`❌ CORS blocked origin: ${origin}`);
    console.warn(`   Allowed origins: ${allowedOrigins.join(', ') || 'None configured'}`);
    console.warn(`   To fix: Add ${origin} to ALLOWED_ORIGINS environment variable`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Health check endpoint (before CORS to allow all origins)
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle preflight OPTIONS requests (CORS middleware already handles this, but explicit handler helps)
app.options('*', cors(), (req, res) => {
  res.sendStatus(200);
});

app.use(errorHandler);

// Main server startup function - connects to database, syncs models, seeds admin, starts server
async function start() {
  try {
    console.log("🔌 Connecting to database...");
    console.log(`   Host: ${process.env.DB_HOST || 'not set'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'not set'}`);
    await db.sequelize.authenticate();
    console.log("✅ Database connection established");

    console.log("🔄 Syncing database models...");
    await db.sequelize.sync({ alter: false });
    console.log("✅ Database models synced");

    console.log("👤 Seeding admin user...");
    await seedAdmin();
    console.log("✅ Admin user ready");

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   CORS Origins: ${allowedOrigins.join(', ') || 'None configured'}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error("❌ Server error:", err.message);
      if (err.code === 'EADDRINUSE') {
        console.error(`   Port ${port} is already in use`);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("❌ Failed to start server:");
    console.error("   Error:", err.message);
    console.error("   Stack:", err.stack);
    if (err.name === 'SequelizeConnectionError') {
      console.error("   Database connection failed. Check DB_HOST, DB_NAME, DB_USER, DB_PASS");
    }
    process.exit(1);
  }
}

start();
