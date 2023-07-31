const router = require('express').Router();
const bookingControllers = require('../controllers/booking.controllers');
const { isAuthenticatedUser } = require('../middlewares/app.authentication');


router.route('/get-bookings-by-user-id/:userId').get(isAuthenticatedUser, bookingControllers.getBookingsByUserId);

router.route('/book-room').post(isAuthenticatedUser, bookingControllers.bookRoom);
router.route('/get-bookings-by-room-id/:roomId').get(isAuthenticatedUser, bookingControllers.getBookingsByRoomId);


module.exports = router;