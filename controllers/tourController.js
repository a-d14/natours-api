const fs = require('fs');

const tours = JSON
.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, val) => {
    if(val * 1 > tours.length) {
        return res.status(404).json({
            status: 'failure',
            message: 'Invalid ID'
        })
    }
    next();
}

exports.checkBody = (req, res, next) => {
    const requestBody = req.body;
    if(!requestBody.name || !requestBody.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'bad request: missing name or price'
        });
    }
    next();
}

exports.getAllTours = (req, res) => {

    const reqTime = req.reqTime;

    res.status(200).json({ 
        // below is the JSON data specification for response to a get request
        status: 'success',
        requestedAt: reqTime,
        results: tours.length, // only when sending an array (for user convenience)
        data: {
            tours: tours
        }
    })
};

exports.createTour = (req, res) => { // 'req' stores the data that the client sends the server
    // console.log(req.body); // body is available as we used the middleware express.json()

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({ // 201 - created
                // format for post request response
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    )
    //res.send('Done!');
}

exports.getTour = (req, res) => { 

    // console.log(req.params);
    const id = req.params.id * 1; // converts string to integer
    const tour = tours.find(el => el.id === id);

    // if(!tour) {
    //     res.status(404).json({
    //         status: 'failure',
    //         message: 'Invalid ID'
    //     })
    // } else {
    //     res.status(200).json({ 
    //         // below is the JSON data specification for response to a get request
    //         status: 'success',
    //         data: {
    //             tour: tour
    //         }
    //     })
    // }
    res.status(200).json({ 
        // below is the JSON data specification for response to a get request
        status: 'success',
        data: {
            tour: tour
        }
    })
}

exports.updateTour = (req, res) => {

    const id = req.params.id * 1; // converts string to integer
    const tour = tours.find(el => el.id === id);

    // if(!tour) {
    //     res.status(404).json({
    //         status: 'failure',
    //         message: 'Invalid ID'
    //     })
    // } else {
    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             tour: '<Updated tour here ... >'
    //         }
    //     })
    // }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here ... >'
        }
    })
}

exports.deleteTour = (req, res) => {

    const id = req.params.id * 1; // converts string to integer
    const tour = tours.find(el => el.id === id);

    // if(!tour) {
    //     res.status(404).json({
    //         status: 'failure',
    //         message: 'Invalid ID'
    //     })
    // } else {
    //     res.status(204).json({ // 204 - no content
    //         status: 'success',
    //         data: null // no data being sent
    //     })
    // }
    res.status(204).json({ // 204 - no content
        status: 'success',
        data: null // no data being sent
    })
}