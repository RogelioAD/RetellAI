import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CallRecord = sequelize.define(
    "CallRecord",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      retellCallId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    { timestamps: true }
  );

  return CallRecord;
};
