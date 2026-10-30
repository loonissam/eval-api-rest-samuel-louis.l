const db = require('./../config/db.js');
const { DataTypes } = require('sequelize');

const Comment = db.define('Comment', {
    id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postId: {
        type: DataTypes.STRING(36),
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING(36),
        allowNull: false
    },
}, {
    tableName: "comments"
});

module.exports = Comment;
