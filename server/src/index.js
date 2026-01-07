import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { hash } from "bcrypt";
import { port, jwtSecret } from "./config.js";
import db from "./models/indexModel.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import callsRoute from "./routes/callsRoute.js";
import webhookRoute from "./routes/webhookRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// CORS configuration - restrict to specific origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(origin => origin)
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.) in development
    if (!origin) {
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Origin required in production'));
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Reject in production if not in allowed list
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parser with size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Validate JWT_SECRET is set in production
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

// Error handler middleware (must be last)
app.use(errorHandler);

// Seed admin user on startup
async function seedAdmin() {
  try {
    const { User } = db;
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      if (process.env.NODE_ENV === 'production') {
        console.warn("⚠️  ADMIN_PASSWORD not set - skipping admin seed");
      }
      return;
    }

    const passwordHash = await hash(adminPassword, 10);

    const [admin, created] = await User.findOrCreate({
      where: { username: adminUsername },
      defaults: {
        username: adminUsername,
        passwordHash,
        role: "admin",
      },
    });

    if (!created) {
      // User already exists → update password
      admin.passwordHash = passwordHash;
      admin.role = "admin";
      await admin.save();
    }
  } catch (err) {
    console.error("⚠️  Error seeding admin (non-fatal):", err.message);
    // Don't exit - allow server to start even if seeding fails
  }
}

// Initialize database and start server
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
