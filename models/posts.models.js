const db = require('./../config/db.js');
const { DataTypes } = require('sequelize');

const Post = db.define('Post', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    userId: {
        type: DataTypes.STRING(36),
        allowNull: false
    },
}, {
    tableName: "posts"
});

module.exports = Post;
