import { hash } from "bcrypt";
import { User } from "../models/index.js";

/**
 * Seeds or updates the admin user based on environment variables.
 */
export async function seedAdmin() {
  try {
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
      admin.passwordHash = passwordHash;
      admin.role = "admin";
      await admin.save();
    }
  } catch (err) {
    console.error("⚠️  Error seeding admin (non-fatal):", err.message);
  }
}

