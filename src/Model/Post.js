import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelizeDB/sequelize.config.js";

const Post = sequelize.define(
  "Post",
  {
    author: {
      type: DataTypes.STRING, //will only store up to 255 characters
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT, //text can store much more  data than a string
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true, //this will set the table name as the model name
  }
);

export default Post;
