const router = require('express').Router();
const roomController = require('../controllers/room.controllers');
const { isAuthenticatedUser, isAdmin } = require('../middlewares/app.authentication');
const roomImageUpload = require('../middlewares/room.image.upload');


router.route('/get-rooms-list-by-hotel-slug/:hotelSlug').get(roomController.getRoomsByHotelSlug);
router.route('/get-room-by-id-or-slug/:id').get(roomController.getRoomByIdOrSlug);
router.route('/create-room').post(isAuthenticatedUser, roomImageUpload.array('roomImages', 5), roomController.createRoom);

module.exports = router;