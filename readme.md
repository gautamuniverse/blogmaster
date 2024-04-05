# BlogMaster

BlogMaster is a RESTful API for a blog platform that allows users to create, read, update, and delete blog posts, as well as manage tags associated with those posts. It is built using Node.js, Express, and MySQL (with Sequelize ORM).

## Features

- **Role-Based User Authentication**: Register, Login, Logout
- **Post Management**:
  - Add a new post
  - Get all posts
  - Get all posts of the current user
  - Get a specific post by ID
  - Delete a post by ID
  - Update a post (content and/or tags)
  - Add tags to an existing post
  - Delete tags from a specific post
- **Tagging System**:
  - Ability to add, edit, and delete tags for posts
  - Tags are stored in a separate table with a many-to-many relationship with blog posts
  - Admin users can manage tags for all posts, while regular users can only manage tags for their own posts
- **Search and Filter Functionality**:
  - Search for blog posts based on tags
  - Filter posts by date range, author, or a combination of tags
  - Optimized search queries for performance
- **Authentication Enhancements**:
  - Role-based access control (RBAC) with admin and user roles
  - Only admins can delete posts and manage tags for all posts
  - Regular users can only edit their own posts and tags
- **Error Handling and Validation**:
  - Comprehensive error handling for API endpoints
  - Input validation and sanitization for tag names and other relevant data

## API Endpoints (With Sample Data)

### User Authentication

- `POST /user/register`: Register a new user
  - Request Body:
    ```json
    {
      "name": "Gautam",
      "email": "gautam@gmail.com",
      "password": "gautam123",
      "role": "admin" // Optional, default is 'user'
    }
    ```
- `POST /user/login`: Login a user
  - Request Body:
    ```json
    {
      "email": "gautam@gmail.com",
      "password": "gautam123"
    }
    ```
- `GET /user/signout`: Logout a user (requires JWT authentication)

### Post Management

- `POST /post/add`: Add a new post
  - Request Body:
    ```json
    {
      "content": "This is the first post",
      "tags": ["firstpost", "manytomany"] // Optional, pass an array even for a single tag
    }
    ```
- `GET /post/all`: Get all posts
- `GET /post/user-posts`: Get all posts of the logged-in user
- `GET /post/:id`: Get a specific post by ID
- `DELETE /post/delete/:id`: Delete a post by ID
- `PUT /post/update/:id`: Update a post and its tags
  - Request Body:
    ```json
    {
      "content": "This is updated content",
      "tags": ["facebook"] // This will replace the existing tags for the post
    }
    ```
- `POST /post/add-tags/:id`: Add tags to an existing post
  - Request Body:
    ```json
    {
      "tags": ["instagram"]
    }
    ```
- `DELETE /post/delete-tags/:id`: Delete tags from a specific post
  - Request Body:
    ```json
    {
      "tags": ["instagram"]
    }
    ```

### Post Search and Filtering

- `GET /post/search/tags`: Search posts based on tags
  - Request Body:
    ```json
    {
      "tags": ["manytomany"]
    }
    ```
- `GET /post/search/filter`: Filter posts based on various options
  - Request Body:
    ```json
    {
      "author": "Gautam", // Optional
      "startDate": "2024-04-04", // Optional
      "endDate": "2024-04-05", // Optional
      "tags": ["firstpost"] // Optional
    }
    ```
    - Note: At least one option (author, startDate, endDate, or tags) must be provided.

JWT authentication is automatically taken care of with the JWT token placed in cookies upon login.

## Getting Started

To get started with BlogMaster:

1. Clone the repository
2. Create a `.env` file in the root directory and provide the following keys:
   - `JWT_SECRET` (for JWT token creation)
   - `DB_URL` (MySQL database URL)
3. Install dependencies: `npm install`
4. Start the server: `nodemon index.js`
5. Open your browser and navigate to `http://localhost:3000`

## Testing

To test the functionality of the application, open the `BlogMaster.postman_collection_v2.1.json` file present in the root directory in Postman. This collection contains all the routes with pre-filled data for fast testing of the application.

## UTP

A detailed and comprehensive UTP file has been included in the root directory: `UTP.md`

## Tech Stack

- Node.js
- Express.js
- Sequelize
- MySQL
- jsonwebtoken
- bcrypt

## Other Important Features

- JWT middleware used for protected routes to ensure only authenticated users can access them.
- Express-session used to store the JWT token in the user's browser for session-based authentication.
- Error handling middleware to handle user-defined and unhandled errors.
- dotenv library used to initialize environment variables from the `.env` file.

## Contact Information

- **Author**: Gautam
- **GitHub**: [gautamuniverse](https://github.com/gautamuniverse)
- **LinkedIn**: [Gautam](https://www.linkedin.com/in/gautam-116307bb/)
- **Instagram**: [@gautamuniverse.in](https://www.instagram.com/gautamuniverse.in/)
