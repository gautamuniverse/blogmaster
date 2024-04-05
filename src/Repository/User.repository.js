import User from "../Model/User.js";

class UserRepository {
  //Function to add a new user to the database
  async addUser(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (err) {
      throw err;
    }
  }

  //Function to get user by email
  async findByEmail(email) {
    try {
      // Alternatively, you can use findOne to retrieve a single record based on a condition
      const result = User.findOne({
        where: {
          email: email, // Assuming you want to retrieve the user with this email
        },
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default UserRepository;