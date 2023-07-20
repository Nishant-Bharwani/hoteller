const mongoose = require('mongoose');
const validator = require('validator')
const Schema = mongoose.Schema;
const crypto = require('crypto');

const usersSchema = Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Username field is required']
    },

    fullname: {
        type: String,
        required: [true, 'Full name field is required']
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'Email filed is required'],
        validate: [validator.isEmail, 'Please enter a valid email address']
    },

    phone: {
        type: String,
        unique: true,
        validate: [validator.isMobilePhone, 'Please enter a valid phone number']
    },

    password: {
        type: String,
        required: [true, 'Password filed is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },

    avatar: {
        type: String,
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },

    dob: {
        type: Date,
        required: [validator.isDate, 'Date of birth filed is required']
    },

    address: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ['register', 'login', 'logout', 'blocked'],
        default: 'register'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date

}, { timestamps: true });

usersSchema.pre('save', function(next) {
    if (this.username) {
        this.username = this.username.replace(/\s/g, '-');
    }

    next();
});

usersSchema.methods.getResetPasswordToken = function () {
    // Generating token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
  };

module.exports = mongoose.model('Users', usersSchema);