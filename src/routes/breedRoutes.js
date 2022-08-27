const { Router } = require('express');
const router = Router();

const { getDogBreed, getBreedById, createDogBreed } = require('../controllers/breedController');

router.route('/').get(getDogBreed).post(createDogBreed);
router.route('/:id').get(getBreedById);

module.exports = router;