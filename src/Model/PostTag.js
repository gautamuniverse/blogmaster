//A join table used for Many to many association between Post and Tag table.

import { sequelize } from "../config/sequelizeDB/sequelize.config.js";
import Post from "./Post.js";
import Tag from "./Tag.js";

// PostTag model as a join table
const PostTag = sequelize.define("PostTag", {});

// associations
Post.belongsToMany(Tag, { through: PostTag });
Tag.belongsToMany(Post, { through: PostTag });

export default PostTag;