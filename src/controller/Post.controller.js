import Tag from "../Model/Tag.js";
import PostRepository from "../Repository/Post.repository.js";
import UserRepository from "../Repository/User.repository.js";
import AppplicationError from "../errorHandler/errorHandler.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  //Function to add a new post
  async addPost(req, res, next) {
    try {
      //Get the values from the body.
      const { content, tags } = req.body;

      if (!content) throw new AppplicationError("Content is required", 400);

      //Get the email from the req
      const email = req.email;

      //get the user details from the User table
      const userDetails = await new UserRepository().findByEmail(email);

      //Get the name from the userDetails
      const name = userDetails.name;

      //Create an object with all the data and pass it to the repository function
      const newPost = {
        author: name,
        content,
        email,
      };

      const addedPost = await this.postRepository.addPost(newPost);
      //Tags are not empty then we will be creating each tag storing into the Tag table first and then we will push the newly created tag into the array which we will add to the existing Post
      if (tags) {
        // Array for holding the tag objects
        const tagObjects = [];

        // Iterate through the tags
        for (const tag of tags) {
          // Find the tag in the database
          let existingTag = await Tag.findOne({ where: { tag: tag } });

          // If the tag doesn't exist, create it
          if (!existingTag) {
            existingTag = await Tag.create({ tag: tag });
          }

          // Push the tag object to the array
          tagObjects.push(existingTag);
        }
        // Add the tags to the post
        await addedPost.addTags(tagObjects);
      }

      return res.status(201).send({
        success: true,
        message: "Post created successfull!",
        data: addedPost,
        tags: tags ? tags : null,
      });
    } catch (err) {
      next(err);
    }
  }

  //function to get all the posts
  async getAllPosts(req, res, next) {
    try {
      const posts = await this.postRepository.getAllPosts();
      if (!posts) throw new AppplicationError("No posts found!", 404);
      return res.status(200).send({
        success: true,
        data: posts,
      });
    } catch (err) {
      next(err);
    }
  }

  //function to get all the posts by a specific user
  async getPostsByEmail(req, res, next) {
    try {
      //get the email from the req
      const email = req.email;
      const posts = await this.postRepository.getPostsByEmail(email);
      if (!posts) throw new AppplicationError("No posts found!", 404);
      return res.status(200).send({
        success: true,
        data: posts,
      });
    } catch (err) {
      next(err);
    }
  }

  //Function to get post by id
  async getPostById(req, res, next) {
    try {
      //Get the id
      const id = req.params.id;
      if (!id)
        return res.status(404).send({
          success: false,
          message: "Id is not  provided!",
        });

      //get the post
      const result = await this.postRepository.getPostById(id);

      if (result.success) return res.status(200).send(result);
      else return res.status(404).send(result);
    } catch (err) {
      next(err);
    }
  }

  //Function to delete a specific post by its id
  async deletePostById(req, res, next) {
    try {
      //Get the email to make sure that the user deleted their own post only
      const email = req.email;

      //validate the id
      const id = req.params.id;
      console.log(req.params);
      if (!id) throw new AppplicationError("Please pass the post id", 404);
      //delete the post using the id
      const result = await this.postRepository.deletePostById(id, email);
      if (!result) throw new AppplicationError("The Post was not deleted!");

      return res.status(200).send({
        success: true,
        message: "Deleted Successfully",
      });
    } catch (err) {
      next(err);
    }
  }
  // Update post content or tag or both.
  async updatePost(req, res, next) {
    try {
      //get the id
      const id = req.params.id;

      //Get the email to make sure that the user deleted their own post only
      const email = req.email;

      //get the data from the body
      const { content, tags } = req.body;

      //Validate the values
      if (!id) {
        return new AppplicationError("id is missing!", 400);
      }

      const updatedPostData = {
        content,
      };

      let updatedTags = tags ? tags : null;

      //Update the post
      const result = await this.postRepository.updatePost(
        id,
        updatedPostData,
        updatedTags,
        email
      );
      if (result.success) return res.status(201).send(result);
      else return res.status(400).send(result);
    } catch (err) {
      next(err);
    }
  }

  //Function to add tags to an existing post
  async addTagsToPost(req, res, next) {
    try {
      //Get the post id
      const id = req.params.id;

      //Get the email to make sure that the user deleted their own post only
      const email = req.email;

      //get the tags
      const { tags } = req.body;

      //Validate the values
      if (!id || !tags) {
        return new AppplicationError("id, tags or both are missing!", 400);
      }

      const result = await this.postRepository.addTagsToPost(id, tags, email);

      if (result.success) return res.status(201).send(result);
      else return res.status(400).send(result);
    } catch (err) {
      next(err);
    }
  }
  //Function to remove tags from a sepcific post
  async deleteTagsFromPost(req, res, next) {
    try {
      const id = req.params.id;
      const { tags } = req.body;

      //Get the email to make sure that the user deleted their own post only
      const email = req.email;

      //Validate the values
      if (!id) {
        return new AppplicationError("id is missing!", 400);
      }

      //Validate the values
      if (!tags) {
        return new AppplicationError("tags are missing!", 400);
      }

      //Delete the tags
      const result = await this.postRepository.deleteTagsFromPost(
        id,
        tags,
        email
      );
      if (!result.success) return res.status(404).send(result);
      else return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  //Function to search posts based on tags
  async searchPostsByTags(req, res, next) {
    try {
      const { tags } = req.body;
      //Validate the values
      if (!tags) {
        return new AppplicationError("Tags are missing!", 400);
      }

      //get the posts
      const result = await this.postRepository.searchPostsByTags(tags);

      if (!result.success) return res.status(404).send(result);
      else return res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  }

  async filterPosts(req, res, next) {
    try {
      let { startDate, endDate, author, tags } = req.body;

      // Parse dates only if they are provided
      if (startDate) startDate = new Date(startDate);
      if (endDate) endDate = new Date(endDate);

      //If no filter options passed by user then show error response.
      if (!startDate && !endDate && !author && !tags)
        return res.status(400).send({
          success: false,
          message:
            "Please provide at least one filter criterion to search posts!",
        });

      const result = await this.postRepository.filterPosts({
        startDate,
        endDate,
        author,
        tags,
      });
      if (!result.success) return res.status(404).send(result);
      else return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
