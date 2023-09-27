const express = require("express");
const tourController = require('./../controllers/tourController');
const router = express.Router();

router
.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours);

router
.route('/getTourStats')
.get(tourController.getTourStats);

router
.route('/getMonthlyPlan/:year')
.get(tourController.getMonthlyPlan);

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour); // chaining multiple middlewares to a HTTP action on a particular route

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;