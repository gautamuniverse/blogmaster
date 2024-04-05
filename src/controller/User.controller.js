import UserRepository from "../Repository/User.repository.js";
import AppplicationError from "../errorHandler/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  //Function to add a new user to the database
  async addUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        throw new AppplicationError(
          "Please make sure all the required fields are passed in the body.",
          400
        );
      }
      //Check if the user already exists
      let existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppplicationError("This email is already taken.", 409);
      }

      //Encrypt the password before storing into the database
      const encryptedPassword = await bcrypt.hash(password, 10);

      //Create new user
      let user = await this.userRepository.addUser({
        name,
        email,
        password: encryptedPassword,
        role: role ? role : "user",
      });
      return res
        .status(201)
        .json({ success: true, message: "User created successfully.", data: user });
    } catch (err) {
      next(err);
    }
  }

  //Function to login the user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      //Validate the email and password are not undefined
      if (!email || !password) {
        throw new AppplicationError(
          "Please make sure all the required fields are passed in the body.",
          400
        );
      }

      //get the user from the database
      const result = await this.userRepository.findByEmail(email);

      if (!result) {
        throw new AppplicationError("The user doesn't exist!", 401);
      } else {
        const passFromDB = result.password;
        //Check if the password is correct by comparing the hashed passwords
        //Compare using bcrypt (enter raw password first, and hashed pass in 2nd argument)
        const comparePass = await bcrypt.compare(password, passFromDB);
        //If passwords match
        if (comparePass) {
          //Check if already signed in
          if (req.cookies.jwt) {
            const now = new Date().getTime() / 1000;
            const payload = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
            const expires = payload.exp;
            // Compare expiration date to current timestamp
            if (expires && expires > now) {
              // Cookie not expired
              return res
                .status(200)
                .send({ success: true, msg: "You are already logged in." });
            }
          }

          //create token
          const token = jwt.sign(
            {
              userId: result.id,
              email: email,
            },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 } // Token expires in 1 hour
          );

          //attach token to the user's response so that the user will send the token with subsequent requests
          const options = {
            maxAge: 60 * 60 * 1000, //cookie will expire in 1 hour
          };

          res.cookie("jwt", token, options); //Cookie name is jwt

          return res.status(200).send({
            success: true,
            message: "You have successfully logged in!",
          });
        } else {
          return res.status(401).send({
            success: false,
            message: "Invalid password, please try again!",
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }

  //Function to signout a user
  async signout(req, res, next){
        res.clearCookie("jwt");
        return res.status(200).json({
          success:true,
          message:"User has been signed out!"
        })
  }
}

export default UserController;
