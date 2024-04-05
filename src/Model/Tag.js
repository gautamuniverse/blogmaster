import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelizeDB/sequelize.config.js";

const Tag = sequelize.define(
  "Tag",
  {
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true, //this will set the table name as the model name
  }
);

export default Tag;
