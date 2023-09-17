const express = require("express");
const tourController = require('./../controllers/tourController');
const router = express.Router();

router.param('id', tourController.checkId);

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.checkBody, tourController.createTour); // chaining multiple middlewares to a HTTP action on a particular route

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;