import { Op } from "sequelize";
import Post from "../Model/Post.js";
import Tag from "../Model/Tag.js";
import User from "../Model/User.js";
import AppplicationError from "../errorHandler/errorHandler.js";

class PostRepository {
  //Function to add a new post
  async addPost(data) {
    try {
      const post = await Post.create(data);
      return post;
    } catch (err) {
      throw err;
    }
  }

  //function to get all the posts
  async getAllPosts() {
    try {
      const posts = await Post.findAll({
        include: {
          model: Tag,
          attributes: ["id", "tag"], // Include only id and tag fields from Tag model
        },
      });
      return posts;
    } catch (err) {
      throw err;
    }
  }

  //function to get all the posts by a specific user
  async getPostsByEmail(email) {
    try {
      const posts = await Post.findAll({
        where: { email: email },
        include: {
          model: Tag,
          attributes: ["id", "tag"], // Include only id and tag fields from Tag model
        },
      });
      return posts;
    } catch (err) {
      throw err;
    }
  }

  //Function to delete a specific post by its id
  async deletePostById(id, email) {
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return {
          success: false,
          message: "User not found!",
        };
      }
      let post;
      // Check if the user is admin
      if (user.role !== "admin") {
        // If the user is not admin, check if the post belongs to the user
        post = await Post.findByPk(id, { include: Tag });

        if (!post) {
          return {
            success: false,
            message: "Post not found",
          };
        }

        if (post.email !== email) {
          return {
            success: false,
            message: "You are not authorized to perform this action",
          };
        }
      }

      post = await Post.destroy({
        where: {
          id: id,
        },
      });
      if (post > 0)
        return {
          success: true,
          message: "Post deleted successfully!",
        };
    } catch (err) {
      throw err;
    }
  }

  //Function to get post by id
  async getPostById(id) {
    try {
      // Find the post by ID
      const post = await Post.findByPk(id, {
        include: {
          model: Tag,
          attributes: ["id", "tag"], // Include only id and tag fields from Tag model
        },
      });

      if (!post) {
        return {
          success: false,
          message: "Post not found",
        };
      } else
        return {
          success: true,
          message: post,
        };
    } catch (err) {
      throw err;
    }
  }

  //Function to update a post
  async updatePost(postId, updatedPostData, updatedTags, email) {
    try {
      //   // Find the post by ID
      //   const post = await Post.findByPk(postId);

      //   if (!post || post.email !== email) {
      //     return {
      //       success: false,
      //       message: "You are not authorized to perform this action",
      //     };
      //   }

      // Find the user by email
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return {
          success: false,
          message: "User not found!",
        };
      }
      let post;
      // Check if the user is admin
      if (user.role !== "admin") {
        // If the user is not admin, check if the post belongs to the user
        post = await Post.findByPk(postId, { include: Tag });

        if (!post) {
          return {
            success: false,
            message: "Post not found",
          };
        }

        if (post.email !== email) {
          return {
            success: false,
            message: "You are not authorized to perform this action",
          };
        }
      }

      // Update post details
      if (!post) post = await Post.findByPk(postId, { include: Tag });

      await post.update(updatedPostData);

      // If updatedTags are provided, update the tags associated with the post
      if (updatedTags && updatedTags.length > 0) {
        // Remove existing tags from the post
        await post.setTags([]);

        // Add updated tags to the post
        const tagObjects = [];
        for (const tagName of updatedTags) {
          let tag = await Tag.findOne({ where: { tag: tagName } });
          if (!tag) {
            tag = await Tag.create({ tag: tagName });
          }
          tagObjects.push(tag);
        }
        await post.addTags(tagObjects);
      }

      //Remove the existing tags which are not associated with any post
      //get all tags
      const allTags = await Tag.findAll({});
      for (const tag of allTags) {
        const associatedPostsCount = await tag.countPosts();
        if (associatedPostsCount === 0) {
          // If the tag is not associated with any other post, remove it from the Tag table
          await tag.destroy();
        }
      }

      return {
        success: true,
        message: "Post updated successfully",
      };
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  // Function to add tags to an existing post
  async addTagsToPost(id, tags, email) {
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return {
          success: false,
          message: "User not found!",
        };
      }
      let post;
      // Check if the user is admin
      if (user.role !== "admin") {
        // If the user is not admin, check if the post belongs to the user
        post = await Post.findByPk(id, { include: Tag });

        if (!post) {
          return {
            success: false,
            message: "Post not found",
          };
        }

        if (post.email !== email) {
          return {
            success: false,
            message: "You are not authorized to perform this action",
          };
        }
      }

      // Update post details
      if (!post) post = await Post.findByPk(id, { include: Tag });

      // Array to hold tag objects
      const tagObjects = [];

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

      // Add the tags to the post (appends to the existing list if initially not empty)
      await post.addTags(tagObjects);

      return {
        success: true,
        message: "Tags added to post successfully",
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  //Function to delete the existing tags for a post
  async deleteTagsFromPost(id, tagsToRemove, email) {
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return {
          success: false,
          message: "User not found!",
        };
      }
      let post;
      // Check if the user is admin
      if (user.role !== "admin") {
        // If the user is not admin, check if the post belongs to the user
        post = await Post.findByPk(id, { include: Tag });

        if (!post) {
          return {
            success: false,
            message: "Post not found",
          };
        }

        if (post.email !== email) {
          return {
            success: false,
            message: "You are not authorized to perform this action",
          };
        }
      }

      // Update post details
      if (!post) post = await Post.findByPk(id, { include: Tag });
      // Find the tags to be removed
      const tags = await Tag.findAll({ where: { tag: tagsToRemove } });

      //Handle the case where no user passed tags match the existing tags for the post
      if (tags.length === 0) {
        return {
          success: false,
          message: "No tags found to remove",
        };
      }

      // Remove the tags from the post
      await post.removeTags(tags);

      // Check if the removed tags are associated with any other post
      for (const tag of tags) {
        const associatedPostsCount = await tag.countPosts();
        if (associatedPostsCount === 0) {
          // If the tag is not associated with any other post, remove it from the Tag table
          await tag.destroy();
        }
      }

      return {
        success: true,
        message: "Tags removed from post successfully",
      };
    } catch (err) {
      throw err;
    }
  }

  //Function to seach posts based on the tags
  async searchPostsByTags(tags) {
    try {
      // Find posts based on tags
      const posts = await Post.findAll({
        include: {
          model: Tag,
          where: { tag: tags }, // filter posts based on tags
        },
      });

      if (posts.length === 0)
        return {
          success: false,
          message: "No posts found based on the provided tags",
        };
      return {
        success: true,
        message: posts,
      };
    } catch (error) {
      console.error("Error searching posts by tags:", error);
      throw error;
    }
  }

  //Function to search/filter posts based on various options passed by user
  async filterPosts(options) {
    try {
      // Define default options
      const { startDate, endDate, author, tags } = options;
      // Construct the where object based on the provided filters
      const where = {};
      if (startDate && endDate) {
        where.createdAt = { [Op.between]: [startDate, endDate] };
      } else if (startDate) {
        where.createdAt = { [Op.gte]: startDate };
      } else if (endDate) {
        where.createdAt = { [Op.lte]: endDate };
      }
      if (author) {
        where.author = author;
      }
      if (tags && tags.length > 0) {
        where["$Tags.tag$"] = { [Op.in]: tags }; // Filter posts based on tags
      }

      // Find posts based on the constructed where object
      const posts = await Post.findAll({
        where: where,
        include: { model: Tag },
      });

      if (posts.length === 0)
        return {
          success: false,
          message: "No posts found based on the provided search criterea",
        };
      return {
        success: true,
        message: posts,
      };
    } catch (error) {
      console.error("Error filtering posts:", error);
      throw error;
    }
  }
}

export default PostRepository;