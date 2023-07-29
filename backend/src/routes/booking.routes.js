const router = require('express').Router();
const bookingControllers = require('../controllers/booking.controllers');
const { isAuthenticatedUser } = require('../middlewares/app.authentication');


router.route('/book-room').post(isAuthenticatedUser, bookingControllers.bookRoom);
router.route('/get-bookings-by-room-id/:roomId').get(bookingControllers.getBookingsByRoomId);


module.exports = router;