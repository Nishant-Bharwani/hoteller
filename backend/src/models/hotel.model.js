const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = Schema({
    name: {
        type: String,
        trim: true,
        uppercase: true,
        required: [true, 'Name field is required']
    },
    hotelSlug: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Hotel slug filed is required']
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'Address Field is required']
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cities',
        required: [true, 'City Field is required']
    },
    rating: {
        type: Number
    },
    description: {
        type: String
    },

    facilities: [{ type: String }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Added By Field is required']
    },
    hotelImages: [{
        url: {
            type: String,
            required: [true, 'Room image filed is required']
        }
    }],
    hotelReviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: [true, 'Room created by is required field']
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],

}, { timestamps: true });


hotelSchema.pre('save', function(next) {
    if (this.hotelSlug) {
        this.hotelSlug = this.hotelSlug.replace(/\s/g, '-');
    }
});

module.exports = mongoose.model('Hotels', hotelSchema);