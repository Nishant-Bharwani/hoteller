const hotelControllers = require('../controllers/hotel.controllers');

const router = require('express').Router();

router.route('/all-hotels-list').get(hotelControllers.getAllHotels);
router.route('/get-hotel-by-city/:city').get(hotelControllers.getHotelsByCityName);
router.route('/get-hotel-by-id-or-slug/:id').get(hotelControllers.getHotelByIdOrSlug);


module.exports = router;