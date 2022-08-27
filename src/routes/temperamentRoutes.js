const { Router } = require('express');
const router = Router();

const { getTemperaments } = require('../controllers/temperamentController');

router.route('/').get(getTemperaments);

module.exports = router;