const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {

    try {

        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query =  Tour.find(JSON.parse(queryStr));

        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
            // sort('price ratingsAverage')
        } else {
            query = query.sort('-createdAt');
        }

        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        const tours = await query;

        res.status(200).json({ 
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'failure',
            message: err
        });
    }
};

exports.getTour = async (req, res) => { 

    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'failure',
            message: err
        });
    }

}

exports.createTour = async (req, res) => { // 'req' stores the data that the client sends the server

    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'failure',
            message: err
        });
    }
    
}

exports.updateTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'failure',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({ // 204 - no content
            status: 'success',
            data: null // no data being sent
        })
    } catch(err) {
        res.status(400).json({ // 204 - no content
            status: 'failure',
            message: 'delete was not successful'
        })
    }
}