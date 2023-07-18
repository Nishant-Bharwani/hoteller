const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = Schema({
    name: {
        type: String,
        required: [true, "City Name is required"]
    },
    state: {
        type: String,
        required: [true, "State name is required"]
    },
    country: {
        type: String,
        required: [true, "Country name is required"]
    }
}, { timestamps: true });

module.exports = mongoose.model('Cities', citySchema);