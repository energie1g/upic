const multer = require('multer');
const User = require('../models/userModel');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/pImages');
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
const upload = multer({ storage, fileFilter: filter }).single('pFile');

exports.updatePImage = (req, res) => {
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

            // User id
            const _id = req.params.id;

            console.log(
                'REQUEST pFILE ******************************************\n',
                req.file
            );

            const imgUrl = req.file
                ? `http://localhost:8000/uploads/pImages/${req.file.filename}`
                : `http://localhost:8000/uploads/unknown.png`;

            const newUser = await User.findByIdAndUpdate(
                _id,
                { photo: imgUrl },
                {
                    new: true,
                    runValidators: true
                }
            );

            return res.status(200).json({
                status: 'success',
                user: newUser
            });
        } catch (error) {
            res.status(400).json({
                staus: 'error',
                message: error
            });
        }
    });
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const _id = `${req.params.id}`;
        const user = await User.findById(_id).populate({
            path: 'images'
        });
        res.status(200).json({
            status: 'success',
            user
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            status: 201,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // retourne le nouveau document modifié <new: true>
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error
        });
    }
};

exports.toggleAbonneUser = async (req, res) => {
    try {
        let userToFollow;
        let userFollowing;
        const id = `${req.params.id}`;

        const abonne = await User.find({
            _id: id,
            abonnes: { $elemMatch: { $eq: req.body.abonne } }
        }).countDocuments();

        if (abonne === 0) {
            userToFollow = await User.findByIdAndUpdate(
                id,
                { $inc: { nAbonnes: 1 }, $push: { abonnes: req.body.abonne } },
                {
                    new: true,
                    runValidators: true
                }
            );

            userFollowing = await User.findByIdAndUpdate(
                req.body.abonne,
                {
                    $push: { abonnements: id }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        } else {
            userToFollow = await User.findByIdAndUpdate(
                id,
                { $inc: { nAbonnes: -1 }, $pull: { abonnes: req.body.abonne } },
                {
                    new: true,
                    runValidators: true
                }
            );

            userFollowing = await User.findByIdAndUpdate(
                req.body.abonne,
                {
                    $pull: { abonnements: id }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        }

        res.status(200).json({
            status: 'success',
            userToFollow,
            userFollowing
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error
        });
    }
};

exports.getAbonnes = async (req, res) => {
    try {
        const id = `${req.params.id}`;
        const is = `${req.params.is}`;
        const abonne = await User.find({
            _id: id,
            abonnes: { $elemMatch: { $eq: is } }
        }).countDocuments();

        console.log('inside getAbonnes');

        res.status(200).json({
            status: 'success',
            abonne
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error
        });
    }
};
