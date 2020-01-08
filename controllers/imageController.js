const multer = require('multer');
const Image = require('../models/ImageModel');
const User = require('../models/userModel');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const filter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Upload images only!'), false);
    }
};

// field = file
const upload = multer({ storage, fileFilter: filter }).single('filepond');

exports.postImage = (req, res) => {
    upload(req, res, async err => {
        try {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            }
            if (err) {
                return res.status(500).json({
                    message: {
                        multerError: {
                            error: 'Télécharger seulement des images!'
                        }
                    }
                });
            }

            console.log(
                'REQUEST ******************************************',
                req.body
            );

            const imgUrl = req.file
                ? `http://localhost:8000/uploads/${req.file.filename}`
                : null;

            const newImage = await Image.create({
                ...req.file,
                imgUrl,
                user: req.body.user,
                description: req.body.description
            });

            return res.status(200).json({
                status: 'success',
                image: newImage
            });
        } catch (error) {
            res.status(400).json({
                staus: 'error',
                message: error
            });
        }
    });
};

exports.getAllImages = async (req, res) => {
    try {
        const images = await Image.find()
            .sort({
                createdAt: -1
            })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .populate({
                path: 'user',
                select: '-__v -password -confirmPassword'
            });

        res.status(200).json({
            status: 'success',
            images: images
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        });
    }
};

exports.getImage = async (req, res) => {
    try {
        const id = `${req.params.id}`;
        const image = await Image.findById(id)
            .populate({
                path: 'user',
                select: '-__v -password -confirmPassword'
            })
            .populate({
                path: 'comments',
                select: '-__v'
            });

        // console.log('GETIMAGE > IMAGE ', image);

        res.status(200).json({
            status: 'success',
            image
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error
        });
    }
};

exports.toggleLikeImage = async (req, res) => {
    try {
        let image;
        let user;
        const id = `${req.params.id}`;
        const liker = req.body.liker
            ? await Image.find({
                  _id: id,
                  likers: { $elemMatch: { $eq: req.body.liker } }
              }).countDocuments()
            : -1;

        if (liker === 0) {
            image = await Image.findByIdAndUpdate(
                id,
                { $inc: { likes: 1 }, $push: { likers: req.body.liker } },
                {
                    new: true,
                    runValidators: true
                }
            );

            user = await User.findByIdAndUpdate(
                req.body.liker,
                {
                    $push: { likedImages: id }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        } else if (liker === 1) {
            image = await Image.findByIdAndUpdate(
                id,
                { $inc: { likes: -1 }, $pull: { likers: req.body.liker } },
                {
                    new: true,
                    runValidators: true
                }
            );

            user = await User.findByIdAndUpdate(
                req.body.liker,
                {
                    $pull: { likedImages: id }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        }

        if (liker === 1 || liker === 0)
            res.status(200).json({
                status: 'success',
                image,
                user
            });
        else
            res.status(400).json({
                status: 'error',
                message: 'The user is null'
            });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error
        });
    }
};

exports.getLikers = async (req, res) => {
    try {
        const id = `${req.params.id}`;
        const is = `${req.params.is}`;
        const liker = await Image.find({
            _id: id,
            likers: { $elemMatch: { $eq: is } }
        }).countDocuments();

        res.status(200).json({
            status: 'success',
            liker
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error
        });
    }
};
