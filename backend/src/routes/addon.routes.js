const addonControllers = require('../controllers/addon.controllers');

const router = require('express').Router();

router.route('/get-all-addons').get(addonControllers.getAllAddons);


module.exports = router;