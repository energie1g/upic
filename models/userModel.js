const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, 'Le champ nom est obligatoire'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Le champ email est obligatoire'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, 'Adresse mail non valide']
        },
        photo: String,
        password: {
            type: String,
            required: [true, "Le champ 'mot de pass' est obligatoire"],
            minlength: 8,
            select: false
        },
        confirmPassword: {
            type: String,
            required: [true, 'Veuillez confirmer votre mot de passe'],
            validate: {
                // We don't need to use the arrow function because we have to use
                // the (this) keyword
                // N.B. this only works with SAVE (Update) and CREATE (well.. on create.)!
                validator: function(el) {
                    return el === this.password;
                },
                message: 'Les mots de passe ne sont pas les mêmes'
            }
        },
        passwordChangedAt: Date,
        images: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Image'
            }
        ],
        likedImages: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Image'
            }
        ],
        comments: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Comment'
            }
        ],
        abonnes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ],
        abonnements: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ],
        nAbonnes: {
            type: Number,
            default: 0
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

    next();
});

// Instance methods
userSchema.methods.checkPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function(JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimeStamp < changedTimeStamp;
    }

    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
