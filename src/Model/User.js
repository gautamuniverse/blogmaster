import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelizeDB/sequelize.config.js";

//Create and define the user model for User table.
const User = sequelize.define("User", {
  //fields
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin","user"),
    defaultValue: "user",
    logging: false
  }
},
{
    freezeTableName: true,  //this will set the table name as the model name
    timestamps: false,
});


export default User;