import { Sequelize } from "sequelize";
import AppplicationError from "../../errorHandler/errorHandler.js";

// Initialize a new Sequelize instance with the blogmaster database credentials
export const sequelize = new Sequelize(
  process.env.DB_URL, //My DB connection url (mysql)
  //uncomment the below line to enable loggin for the sequelize
  { logging: false}
);

//Writing the function to connect to the mysql database
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw new AppplicationError("Unable to connect to the database", 500);
  }
}

export default connectDB;
