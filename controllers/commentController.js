const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const Image = require('../models/ImageModel');

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate({
                path: 'image',
                select: 'id imgUrl'
            })
            .populate({
                path: 'user',
                select: 'id nom photo'
            });
        res.status(200).json({
            status: 'success',
            comments
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.getComment = async (req, res) => {
    try {
        const _id = `${req.params.id}`;
        const comment = await Comment.findById(_id)
            .populate({
                path: 'image',
                select: 'id imgUrl'
            })
            .populate({
                path: 'user',
                select: 'id nom photo'
            });
        res.status(200).json({
            status: 'success',
            comment
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.createComment = async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        const imageId = req.body.image;
        const userId = req.body.user;

        const image = await Image.findByIdAndUpdate(
            imageId,
            {
                $push: { comments: comment._id }
            },
            {
                new: true,
                runValidators: true
            }
        );

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $push: { comments: comment._id }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user || !image)
            return res.status(404).json({
                status: 'error',
                message: 'User or Image are null'
            });

        comment.image = image;
        comment.user = user;

        await res.status(201).json({
            status: 201,
            comment
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.updateComment = async (req, res) => {
    try {
        // retourne le nouveau document modifié <new: true>
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!comment) {
            return res.status(404).json({
                status: 'error',
                message: 'There is no comment with such ID'
            });
        }
        res.status(200).json({
            status: 'success',
            comment
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) {
            return res.status(404).json({
                status: 'error',
                message: 'The is no comment with such ID'
            });
        } else if (!comment.image || !comment.user) {
            return res.status(404).json({
                status: 'error',
                message: 'The is no image nor a user with this comment!'
            });
        }

        const image = await Image.findByIdAndUpdate(
            comment.image,
            {
                $pull: { comments: req.params.id }
            },
            {
                new: true,
                runValidators: true
            }
        );

        const user = await User.findByIdAndUpdate(
            comment.user,
            {
                $pull: { comments: req.params.id }
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            status: 'success',
            comment,
            image,
            user
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};
