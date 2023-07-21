const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Addon name field is required"]
    },
    addonSlug: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Room slug filed is required']
    },
    description: {
        type: String,

    },
    price: {
        type: Number,
        required: [true, "Addon price field is required"]
    }

}, { timestamps: true });

addonSchema.pre('save', function(next) {
    if (this.addonSlug) {
        this.addonSlug = this.addonSlug.replace(/\s/g, '-');
    }
    next();
});

module.exports = mongoose.model('Addons', addonSchema);