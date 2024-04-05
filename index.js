import "./env.variabls.js";
import bodyParser from "body-parser";
import express from "express";
import connectDB, {
  sequelize,
} from "./src/config/sequelizeDB/sequelize.config.js";
import User from "./src/Model/User.js";
import Tag from "./src/Model/Tag.js";
import Post from "./src/Model/Post.js";
import PostTag from "./src/Model/PostTag.js";
import UserRouter from "./src/Routes/User.routes.js";
import AppplicationError from "./src/errorHandler/errorHandler.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import PostRouter from "./src/Routes/Post.routes.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";

const app = express();

//Parsing the body data in json format.
app.use(bodyParser.json());

//Using the cookie parser to make cookies in a json format
app.use(cookieParser());

//Setup express session
app.use(
  session({
    secret: "SecretKey",
    resave: "false", //regenrate new session id
    saveUninitialized: "true", //Save the session even if empty
    cookie: { secure: false }, //we are using http so unsecure.
  })
);

//Sync the user models with the sql database. This will create a table if it doesn't exist already.
sequelize.sync({ force: false });

//User Routes (protected route)
app.use("/user",  UserRouter);

//Post Routes
app.use("/post",jwtAuth, PostRouter);

//Application Level Error handler
app.use((err, req, res, next) => {
  console.log("Error picked by the Application level error handler.", err.code);
  //Developer defined errors using the throw keyword
  if (err instanceof AppplicationError) {
    res.status(err.code ? err.code : 500).send(err.message);
  }
  //All other application level errors, not handled by the developer
  else {
    console.log(err);
    res
      .status(500)
      .send("Something went wrong at server end, please try again later!");
  }
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("Server is listening on http://localhost:3000");
  connectDB(); //connect to the mysql database.
});
