const jsonwebtoken = require('jsonwebtoken');
const Post = require('./models/Post');

function auth(req, res, next) {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ message: 'Access denied' });
    }

    try {
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; 
        const postId = req.params.postId;
        
        Post.findById(postId)
            .then(post => {
                if (!post) {
                    return res.status(404).send({ message: 'Post not found' });
                }

                if (post.createdBy.toString() !== req.user._id.toString()) {
                    return res.status(403).send({ message: 'You are not authorized to modify this post' });
                }

                next();
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    } catch (err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
}

module.exports = auth;