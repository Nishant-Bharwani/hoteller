const hotelControllers = require('../controllers/hotel.controllers');
const { isAuthenticatedUser, isAdmin } = require('../middlewares/app.authentication');
const hotelImageUpload = require('../middlewares/hotel.image.upload');

const router = require('express').Router();

router.route('/all-hotels-list').get(hotelControllers.getAllHotels);
// router.route('/get-hotel-by-city/:city').get(hotelControllers.getHotelsByCityName);
router.route('/get-hotel-by-city/').get(hotelControllers.getHotelsByCityName);
router.route('/get-hotel-by-id-or-slug/:id').get(hotelControllers.getHotelByIdOrSlug);

router.route('/create-hotel').post(isAuthenticatedUser, hotelImageUpload.array('hotelImages', 5), hotelControllers.createHotel);


module.exports = router;