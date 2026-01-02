import { Sequelize as SequelizeClass } from "sequelize";
import { db as _db } from "../config.js";
import userModel from "./userModel.js";
import callRecordModel from "./callRecordModel.js";

const sequelizeInstance = new SequelizeClass(_db.database, _db.username, _db.password, {
  host: _db.host,
  port: _db.port,
  dialect: "mysql",
  logging: false,
});

const db = {};

db.Sequelize = SequelizeClass;
db.sequelize = sequelizeInstance;

db.User = userModel(sequelizeInstance);
db.CallRecord = callRecordModel(sequelizeInstance);

// Associations
db.User.hasMany(db.CallRecord, { foreignKey: "userId" });
db.CallRecord.belongsTo(db.User, { foreignKey: "userId" });

// Export named exports for easier importing
export const User = db.User;
export const CallRecord = db.CallRecord;
export const sequelize = db.sequelize;
export const Sequelize = db.Sequelize;

export default db;
