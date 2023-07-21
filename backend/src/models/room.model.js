const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    roomName: {
        type: String,
        unique: true,
        required: [true, 'Room name filed is required']
    },
    roomSlug: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Room slug filed is required']
    },
    roomType: {
        type: String,
        enum: ['single', 'couple'],
        required: [true, 'Room type filed is required']
    },
    roomPrice: {
        type: Number,
        required: [true, 'Room price filed is required']
    },
    roomSize: {
        type: Number,
        required: [true, 'Room size filed is required']
    },
    roomCapacity: {
        type: Number,
        required: [true, 'Room capacity filed is required']
    },
    featuredRoom: {
        type: Boolean,
        default: false
    },
    roomDescription: {
        type: String,
    },
    extraFacilities: [String],
    roomImages: [{
        url: {
            type: String,
            required: [true, 'Room image filed is required']
        }
    }],
    roomReviews: [{
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
    roomStatus: {
        type: String,
        enum: ['available', 'unavailable', 'booked'],
        required: [true, 'Room status filed is required'],
        default: 'available'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Room created by is required field']
    },

}, { timestamps: true });

roomsSchema.pre('save', function(next) {
    if (this.roomSlug) {
        this.roomSlug = this.roomSlug.replace(/\s/g, '-');
    }
    next();
});

module.exports = mongoose.model('Rooms', roomsSchema);