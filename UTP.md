**UTP 1: User Registration**

**Objective:** Verify that a new user can successfully register with the application.

**Prerequisites:**
- The application is running and accessible.
- No user account exists with the test email address.

**Test Steps:**
1. Access the registration endpoint (`POST /user/register`).
2. Provide a valid name, email, and password in the request body.
3. Optionally, provide the "role" field in the request body (default should be "user").
4. Send the request.

**Expected Result:**
- The application should respond with a success status ( 201 CREATED) and a message confirming successful registration.
- The user should be able to log in with the provided credentials.

**UTP 2: User Login**

**Objective:** Verify that a registered user can successfully log in to the application.

**Prerequisites:**
- The application is running and accessible.
- A user account exists with the test email and password.

**Test Steps:**
1. Access the login endpoint (`POST /user/login`).
2. Provide the registered email and password in the request body.
3. Send the request.

**Expected Result:**
- The application should respond with a success status (e.g., 200 OK) and a JWT token.
- The JWT token should be included in the response cookies.
- The user should be able to access protected routes until the JWT token is present in the cookies and not expired.

**UTP 3: User Logout**

**Objective:** Verify that an authenticated user can successfully log out of the application.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.

**Test Steps:**
1. Access the logout endpoint (`GET /user/signout`).
2. Include the JWT token in the request headers or cookies.
3. Send the request.

**Expected Result:**
- The application should respond with a success status (e.g., 200 OK) and a message confirming successful logout.
- The JWT token should be removed from the response cookies.
- The user should no longer be able to access protected routes using the previous JWT token.

**UTP 4: Post Creation**

**Objective:** Verify that an authenticated user can create a new blog post with or without tags.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.

**Test Steps:**
1. Access the post creation endpoint (`POST /post/add`).
2. JWT token must be present in the cookies.
3. Provide the post content in the request body.
4. Optionally, provide an array of tags in the request body.
5. Send the request.

**Expected Result:**
- The application should respond with a success status (e.g., 201 CREATED) and the details of the created post.
- The post content and tags (if provided) should be correctly stored in the database.
- The post should be retrievable using the appropriate endpoint (e.g., `GET /post/:id`).

**UTP 5: Get All Posts**

**Objective:** Verify that users can retrieve a list of all blog posts.

**Prerequisites:**
- The application is running and accessible.
- There are multiple blog posts in the database.

**Test Steps:**
1. Access the get all posts endpoint (`GET /post/all`).
2. Send the request.

**Expected Result:**
- The application should respond with a success status (e.g., 200 OK) and a list of all blog posts.
- The response should include the post content, tags, author, and other relevant details for each post.

**UTP 6: Get User Posts**

**Objective:** Verify that an authenticated user can retrieve a list of their own blog posts.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.
- The user has blog posts in the database.

**Test Steps:**
1. Access the get user posts endpoint (`GET /post/user-posts`).
2. JWT token must be present in the cookies.
3. Send the request.

**Expected Result:**
- The application should respond with a success status (e.g., 200 OK) and a list of blog posts created by the authenticated user.
- The response should include the post content, tags, author, and other relevant details for each post.
- The response should not include posts created by other users.

**UTP 7: Get Post by ID**

**Objective:** Verify that users can retrieve a specific blog post by its ID.

**Prerequisites:**
- The application is running and accessible.
- There is at least one blog post in the database with a known ID.

**Test Steps:**
1. Access the get post by ID endpoint (`GET /post/:id`), replacing `:id` with the ID of an existing post.
2. Send the request.

**Expected Result:**
- The application should respond with a success status (e.g., 200 OK) and the details of the requested post.
- The response should include the post content, tags, author, and other relevant details.
- If the provided ID is invalid or does not exist, the application should respond with an appropriate error message.

**UTP 8: Delete Post**

**Objective:** Verify that an authenticated user can delete their own blog post, and an admin user can delete any post.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.
- The user has at least one blog post in the database.
- An admin user account exists in the database.

**Test Steps:**
1. Access the delete post endpoint (`DELETE /post/delete/:id`), replacing `:id` with the ID of an existing post.
2. JWT token must be present in the cookies.
3. Send the request.
4. Repeat steps 1-3 with an admin user JWT token and a post created by a different user.

**Expected Result:**
- When a regular user deletes their own post, the application should respond with a success status (e.g., 200 OK) and a message confirming the post deletion.
- When an admin user deletes a post, the application should respond with a success status (e.g., 200 OK) and a message confirming the post deletion, regardless of the post author.
- If the provided ID is invalid or does not exist, the application should respond with an appropriate error message.
- Regular users should not be able to delete posts created by other users.

**UTP 9: Update Post**

**Objective:** Verify that an authenticated user can update their own blog post content and tags, and an admin user can update any post.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.
- The user has at least one blog post in the database.
- An admin user account exists in the database.

**Test Steps:**
1. Access the update post endpoint (`PUT /post/update/:id`), replacing `:id` with the ID of an existing post.
2. JWT token must be present in the cookies.
3. Provide the updated post content and/or tags in the request body.
4. Send the request.
5. Repeat steps 1-4 with an admin user JWT token and a post created by a different user.

**Expected Result:**
- When a regular user updates their own post, the application should respond with a success status (201 CREATED) and the updated post details.
- When an admin user updates a post, the application should respond with a success status (201 CREATED) and the updated post details, regardless of the post author.
- The post content and tags should be updated in the database according to the provided data.
- If the provided ID is invalid or does not exist, the application should respond with an appropriate error message.
- Regular users should not be able to update posts created by other users.

**UTP 10: Add Tags to Post**

**Objective:** Verify that an authenticated user can add tags to their own blog post, and an admin user can add tags to any post.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.
- The user has at least one blog post in the database.
- An admin user account exists in the database.

**Test Steps:**
1. Access the add tags to post endpoint (`POST /post/add-tags/:id`), replacing `:id` with the ID of an existing post.
2. JWT token must be present in the cookies.
3. Provide an array of tags to add in the request body.
4. Send the request.
5. Repeat steps 1-4 with an admin user JWT token and a post created by a different user.

**Expected Result:**
- When a regular user adds tags to their own post, the application should respond with a success status (201 CREATED) and the updated post details with the new tags added.
- When an admin user adds tags to a post, the application should respond with a success status (201 CREATED) and the updated post details with the new tags added, regardless of the post author.
- The new tags should be associated with the post in the database. The tags should be added to the post and tag tables through PostTag join table.
- If the provided ID is invalid or does not exist, the application should respond with an appropriate error message.
- Regular users should not be able to add tags to posts created by other users.

**UTP 11: Delete Tags from Post**

**Objective:** Verify that an authenticated user can delete tags from their own blog post, and an admin user can delete tags from any post.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.
- The user has at least one blog post in the database with existing tags.
- An admin user account exists in the database.

**Test Steps:**
1. Access the delete tags from post endpoint (`DELETE /post/delete-tags/:id`), replacing `:id` with the ID of an existing post.
2. JWT token must be present in the cookies.
3. Provide an array of tags to delete in the request body.
4. Send the request.
5. Repeat steps 1-4 with an admin user JWT token and a post created by a different user.

**Expected Result:**
- When a regular user deletes tags from their own post, the application should respond with a success status (200 OK) and the updated post details with the specified tags removed.
- When an admin user deletes tags from a post, the application should respond with a success status (200 OK) and the updated post details with the specified tags removed, regardless of the post author.
- The specified tags should be dissociated from the post in the database.
- If the provided ID is invalid or does not exist, the application should respond with an appropriate error message.
- Regular users should not be able to delete tags from posts created by other users.

**UTP 12: Search Posts by Tags**

**Objective:** Verify that users can search for blog posts based on tags.

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.
- There are multiple blog posts in the database with different tags.

**Test Steps:**
1. Access the search posts by tags endpoint (`GET /post/search/tags`).
2. JWT token must be present in the cookies.
3. Provide an array of tags to search for in the request body.
4. Send the request.

**Expected Result:**
- The application should respond with a success status (200 OK) and a list of blog posts that have at least one of the specified tags associated with them.
- The response should include the post content, tags, author, and other relevant details for each matching post.
- If no posts are found with the specified tags, the response should (404 Not found) with appropriate message.

**UTP 13: Filter Posts**

**Objective:** Verify that users can filter blog posts based on various criteria (author, date range, tags).

**Prerequisites:**
- The application is running and accessible.
- A user is logged in and has a valid JWT token.
- There are multiple blog posts in the database with different authors, creation dates, and tags.

**Test Steps:**
1. Access the post filtering endpoint (`GET /post/search/filter`).
2. Provide one or more filtering criteria in the request body (e.g., author, startDate, endDate, tags). Note: date format - YYYY-MM-DD
3. Send the request.

**Expected Result:**
- The application should respond with a success status (200 OK) and a list of posts matching the provided filtering criteria.
- The response should include only the posts that satisfy all the specified filtering conditions.
- If no posts are found with the specified tags, the response should (404 Not found) with appropriate message.

**UTP 14: Error Handling**

**Objective:** Verify that the application handles errors and edge cases appropriately.

**Prerequisites:**
- The application is running and accessible.

**Test Steps:**
1. Send requests with invalid data or missing required fields to various endpoints.
2. Send requests with invalid or non-existent IDs to endpoints that require an ID parameter.
3. Send requests without proper authentication (e.g., no JWT token or an expired token).
4. Simulate server-side errors or exceptions.

**Expected Result:**
- The application should respond with appropriate error status codes (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error) and meaningful error messages.
- Error responses should not expose sensitive information or internal implementation details.
- User input should be properly validated and sanitized to prevent security vulnerabilities.
- Server-side errors or exceptions should be handled gracefully without causing the application to crash or leak sensitive information.