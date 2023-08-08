const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'User Id field is required']
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: [true, 'Room Id field is required']
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    numberOfGuests: {
        type: Number,
        required: [true, 'Number of guests field is required']
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
        required: [true, 'Status filed is required']
    },
    addons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Addons' }],
    totalPrice: {
        type: Number,
        required: [true, 'Total Price is required field.']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed']
    },
    razorpayPaymentId: { type: String },
    razorpayOrderId: { type: String },
    dateOfBooking: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Bookings', bookingSchema);