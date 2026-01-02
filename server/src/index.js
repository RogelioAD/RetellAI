import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { port, jwtSecret } from "./config.js";
import db from "./models/indexModel.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import callsRoute from "./routes/callsRoute.js";
import webhookRoute from "./routes/webhookRoute.js";

const app = express();

// Security: CORS configuration - restrict to specific origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(origin => origin)
  : ['http://localhost:3000', 'http://localhost:3001'];

// Log allowed origins for debugging
console.log('🌐 CORS Configuration:');
console.log('  ALLOWED_ORIGINS:', allowedOrigins);
console.log('  NODE_ENV:', process.env.NODE_ENV);

app.use(cors({
  origin: function (origin, callback) {
    // Log the incoming origin for debugging
    console.log('🔍 CORS Check - Origin:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, etc.) in development
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      callback(null, true);
      return;
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
      return;
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Development mode - allowing origin');
      callback(null, true);
      return;
    }
    
    // Reject in production if not in allowed list
    console.log('❌ Origin not allowed:', origin);
    console.log('   Allowed origins:', allowedOrigins);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Security: Body parser with size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Security: Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Security: Validate JWT_SECRET is set in production
if (process.env.NODE_ENV === 'production' && (!jwtSecret || jwtSecret === "your-secret-key-change-in-production")) {
  console.error("❌ CRITICAL: JWT_SECRET must be set in production environment!");
  process.exit(1);
}

// Routes
app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/api", callsRoute);
app.use("/webhooks", webhookRoute);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Initialize database and start server
async function start() {
  try {
    // Test database connection
    console.log("🔌 Connecting to database...");
    await db.sequelize.authenticate();
    console.log("✅ Database connection established");

    // Sync models (create tables if they don't exist)
    console.log("🔄 Syncing database models...");
    await db.sequelize.sync({ alter: false });
    console.log("✅ Database models synced");

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();

