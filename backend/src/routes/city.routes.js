const cityControllers = require('../controllers/city.controllers');

const router = require('express').Router();

router.route('/get-all-cities').get(cityControllers.getAllCities);

module.exports = router;