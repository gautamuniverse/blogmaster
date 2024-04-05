import jwt from "jsonwebtoken";
import AppplicationError from "../errorHandler/errorHandler.js";

const jwtAuth = (req, res, next) => {
  let token;
  //Verify the token is presnet in the cookie or not
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }


  if (!token) return res.status(401).send("Unauthorized access!");
  else {
    try {
      //Verify the token against the key and get the payload
      const payLoad = jwt.verify(token, process.env.JWT_SECRET);
      //Add userId to the req data
      req.userId = payLoad.userId;
      req.email = payLoad.email;
    } catch (error) {
      //Send invalid token response
      // res.status(401).send("Inavlid Token");
      throw new AppplicationError("Invalid Token", 401);
    }

    //Call the next middleware in the pipeline
    next();
  }
};

export default jwtAuth;
