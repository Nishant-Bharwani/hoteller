const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Addon name field is required"]
    },
    description: {
        type: String,

    },
    price: {
        type: Number,
        required: [true, "Addon price field is required"]
    }

}, { timestamps: true });

module.exports = mongoose.model('Addons', addonSchema);