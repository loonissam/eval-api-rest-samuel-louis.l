const express = require('express');
const router = express.Router();
const postController = require('./../controller/post.controller.js');
const { auth } = require('./../middleware/auth.middleware.js');

router.get('/', postController.getAll);
router.post('/', auth, postController.create);
router.post('/:postId/comments', auth, postController.addComment);

module.exports = router;