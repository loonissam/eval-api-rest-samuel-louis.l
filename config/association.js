const db = require('./../config/db.js');
const User = require('../models/user.models.js');
const Post = require('../models/posts.models.js');
const Comment = require('../models/comment.models.js');

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = { db, User, Post, Comment };