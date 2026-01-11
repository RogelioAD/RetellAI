import "dotenv/config";
import { hash } from "bcrypt";
import { User, sequelize } from "./models/index.js";

// Standalone script to seed or update admin user from environment variables
async function run() {
  try {
    console.log("🔌 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connection established");

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
      admin.passwordHash = passwordHash;
      admin.role = "admin";
      await admin.save();
      console.log(`🔄 Updated admin user "${adminUsername}"`);
    } else {
      console.log(`✅ Created admin user "${adminUsername}"`);
    }

    console.log("🎉 Admin seed complete!");
    
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    
    try {
      await sequelize.close();
    } catch (closeErr) {
    }
    process.exit(1);
  }
}

run();
