const Post = require('./../models/posts.models.js');
const Comment = require('./../models/comment.models.js');
const User = require('./../models/user.models.js');

const authorInclude = () => ({ model: User, as: 'author', attributes: ['id', 'username'] });

const postInclude = () => [
    authorInclude(),
    { model: Comment, as: 'comments', include: [authorInclude()] }
];

exports.getAll = async (req, res) => {
    const posts = await Post.findAll({
        include: postInclude,
        order: [
            ['createdAt', 'DESC'],
            [{ model: Comment, as: 'comments' }, 'createdAt', 'ASC']
        ]
    });
    return res.status(200).json(posts);
}

exports.create = async (req, res) => {
    const { content } = req.body || {};
    const text = typeof content === 'string' ? content.trim() : '';
    if (text.length < 1 || text.length > 2000) {
        return res.status(400).json({ error: 'Le contenu doit contenir entre 1 et 2000 caractères' });
    }

    const post = await Post.create({ content: text, userId: req.user.id });
    const fullPost = await Post.findByPk(post.id, { include: postInclude });
    return res.status(201).json(fullPost);
}

exports.addComment = async (req, res) => {
    const { content } = req.body || {};
    const text = typeof content === 'string' ? content.trim() : '';
    if (text.length < 1 || text.length > 500) {
        return res.status(400).json({ error: 'Le commentaire doit contenir entre 1 et 500 caractères' });
    }

    const post = await Post.findByPk(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'Publication introuvable' });
    }

    const comment = await Comment.create({ content: text, postId: post.id, userId: req.user.id });
    const fullComment = await Comment.findByPk(comment.id, { include: [authorInclude] });
    return res.status(201).json(fullComment);
}