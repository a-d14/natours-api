const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {

    try {

        // const queryObj = { ...req.query };
        // const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // excludedFields.forEach(el => delete queryObj[el]);

        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // let query =  Tour.find(JSON.parse(queryStr));

        // if(req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        //     // sort('price ratingsAverage')
        // } else {
        //     query = query.sort('-createdAt');
        // }

        // if(req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('-__v');
        // }

        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;

        // query = query.skip(skip).limit(limit);

        // if(req.query.page) {
        //     const numTours = await Tour.countDocuments();
        //     if(skip > numTours) throw new Error('This page does not exist');
        // }

        const features = new APIFeatures(Tour.find(), req.query)
                                        .filter()
                                        .sort()
                                        .limitFields()
                                        .paginate();

        const tours = await features.query;

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

exports.getTourStats = async (req, res) => {
    try {  
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: {$gte: 4.5} }
            },
            {
                $group: {
                    // _id: {$toUpper: '$difficulty'},
                    _id: '$difficulty',
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {
                    avgPrice: 1 // 1 for ascending
                }
            },
            // {
            //     $match: {
            //         _id: {$ne: 'easy'}
            //     }
            // }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'failure',
            message: 'Endpoint not found'
        });
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            }, 
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum : 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {
                    numTourStarts: -1
                }
            },
            {
                $limit: 12
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                length: plan.length,
                plan
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'failure',
            message: err
        });
    }
}
