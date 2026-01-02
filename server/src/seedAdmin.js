import "dotenv/config";
import { hash } from "bcrypt";
import { User, sequelize } from "./models/index.js";

async function run() {
  try {
    // Test database connection
    console.log("🔌 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Sync models (create tables if they don't exist)
    console.log("🔄 Syncing database models...");
    await sequelize.sync({ alter: false });
    console.log("✅ Database models synced");

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("❌ ADMIN_PASSWORD is required in .env");
      await sequelize.close();
      process.exit(1);
    }

    // Hash password
    const passwordHash = await hash(adminPassword, 10);

    // Create or update admin user
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
      console.log(`🔄 Updated admin user "${adminUsername}"`);
    } else {
      console.log(`✅ Created admin user "${adminUsername}"`);
    }

    console.log("🎉 Admin seed complete!");
    
    // Close database connection
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    
    // Close database connection on error
    try {
      await sequelize.close();
    } catch (closeErr) {
      // Ignore close errors
    }
    process.exit(1);
  }
}

run();
