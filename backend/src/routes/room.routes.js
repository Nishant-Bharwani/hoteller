const router = require('express').Router();
const roomController = require('../controllers/room.controllers'); 
const { isAuthenticatedUser, isAdmin } = require('../middlewares/app.authentication');
const roomImageUpload = require('../middlewares/room.image.upload');


router.route('/get-rooms-list-by-hotel-id/:hotelId').get(roomController.getRoomsByHotelId);
router.route('/create-room').post(isAuthenticatedUser, isAdmin, roomImageUpload.array('roomImages', 5), roomController.createRoom);

module.exports = router;