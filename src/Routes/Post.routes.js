import express from "express";
import PostController from "../controller/Post.controller.js";

const PostRouter = express.Router();

const postController = new PostController();

//route to add a new post
PostRouter.post("/add", (req, res, next) =>
  postController.addPost(req, res, next)
);

//Route to  get all posts
PostRouter.get("/all", (req, res, next) =>
  postController.getAllPosts(req, res, next)
);

//route to get all the posts of the current user
PostRouter.get("/user-posts", (req, res, next) =>
  postController.getPostsByEmail(req, res, next)
);

// route to get a specific post by postId
PostRouter.get("/:id", (req, res, next) =>
  postController.getPostById(req, res, next)
);

//Route to delete a post by its post id
PostRouter.delete("/delete/:id", (req, res, next) =>
  postController.deletePostById(req, res, next)
);

//Route to update a post(Also handles the case where we only want to update either of content or tags)
PostRouter.put("/update/:id", (req, res, next) =>
  postController.updatePost(req, res, next)
);

//Route to add tags to an existing post
PostRouter.post("/add-tags/:id", (req, res, next) =>
  postController.addTagsToPost(req, res, next)
);

//Route to delete tags from a specific post
PostRouter.delete("/delete-tags/:id", (req, res, next) =>
  postController.deleteTagsFromPost(req, res, next)
);

//Route to search posts based on tags
PostRouter.get("/search/tags", (req, res, next) =>
  postController.searchPostsByTags(req, res, next)
);

//Route to filter posts based on various options  like date range, tags, author or combination of all.
PostRouter.get("/search/filter", (req, res, next) =>
  postController.filterPosts(req, res, next)
);

export default PostRouter;
