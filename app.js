// ONLY USE THIS TO CONFIGURE EXPERSS

const express = require('express');
const morgan = require('morgan'); // middleware that gived info about request

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES

// middleware - modifies the incoming resource data
// express.json() parses the incoming data only if content-type of the request
// is application/json
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`)); // used to serve static files

/* 
    HOW MIDDLEWARE WORKS - 
    - incoming request --> middleware 1 - next() --> middleware 2 - next() --> ... --> response
    - all the middlewares together is called the middleware stack
    - ORDER OF MIDDLEWARE MATTERS - 
        - IF WE DEFINE an app.use() after an app.route(), the middleware
        will not be used in any of the routes defined. However, if we have
        an app.route() after app.use(), middle-ware will be applied to all
        the routes defined.
    PARAM MIDDLEWARE - 
    - middleware that only runs for certain parameters
        defined with router.param('parameterName', (req, res, next, val) => {
            ...code
            next();
        })
    - GOOD NODE PRACTICE SUGGESTS USING A LOT OF MIDDLEWARE
*/
 
// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
    req.reqTime = new Date().toISOString();
    next();
});

// app.get('/', (req, res) => {
//     res.status(200)
//     .json( // .send() only sends strings
//     {
//         message: 'Hello from the server side!',
//         app: 'Natours'
//     }
//     );
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// })

// 2) CALLBACK FUNCTIONS

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// const getAllTours = (req, res) => {

//     const reqTime = req.reqTime;

//     res.status(200).json({ 
//         // below is the JSON data specification for response to a get request
//         status: 'success',
//         requestedAt: reqTime,
//         results: tours.length, // only when sending an array (for user convenience)
//         data: {
//             tours: tours
//         }
//     })
// };

// const createTour = (req, res) => { // 'req' stores the data that the client sends the server
//     // console.log(req.body); // body is available as we used the middleware express.json()

//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({id: newId}, req.body);

//     tours.push(newTour);

//     fs.writeFile(
//         `${__dirname}/dev-data/data/tours-simple.json`,
//         JSON.stringify(tours),
//         err => {
//             res.status(201).json({ // 201 - created
//                 // format for post request response
//                 status: 'success',
//                 data: {
//                     tour: newTour
//                 }
//             });
//         }
//     )
//     //res.send('Done!');
// }

// const getTour = (req, res) => { 

//     console.log(req.params);
//     const id = req.params.id * 1; // converts string to integer
//     const tour = tours.find(el => el.id === id);

//     if(!tour) {
//         res.status(404).json({
//             status: 'failure',
//             message: 'Invalid ID'
//         })
//     } else {
//         res.status(200).json({ 
//             // below is the JSON data specification for response to a get request
//             status: 'success',
//             data: {
//                 tour: tour
//             }
//         })
//     }
// }

// const updateTour = (req, res) => {

//     const id = req.params.id * 1; // converts string to integer
//     const tour = tours.find(el => el.id === id);

//     if(!tour) {
//         res.status(404).json({
//             status: 'failure',
//             message: 'Invalid ID'
//         })
//     } else {
        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         tour: '<Updated tour here ... >'
        //     }
        // })
//     }
// }

// const deleteTour = (req, res) => {

//     const id = req.params.id * 1; // converts string to integer
//     const tour = tours.find(el => el.id === id);

//     if(!tour) {
//         res.status(404).json({
//             status: 'failure',
//             message: 'Invalid ID'
//         })
//     } else {
//         res.status(204).json({ // 204 - no content
//             status: 'success',
//             data: null // no data being sent
//         })
//     }
// }

// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// }

// const getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// }

// const createUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// }

// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// }

// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!'
//     });
// }

// 3) ROUTES

/*
TO SEPARATE THE ROUTES OF EACH RESOURCE INTO DIFFERENT FILES, WE CANNOT USE THE SAME 'APP' 
ROUTER FOR ALL RESOURCES. THEREFORE, WE NEED TO HAVE SEPARATE ROUTERS FOR EACH. WE CAN DO
THAT USING THE ROUTER MIDDLEWARE AS SEEN BELOW.
*/

// const tourRouter = express.Router();
// const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id/:y?', getTour); // 'y' is an optional parameter

// with PUT we expect the entire updated object, but with PATCH we only
// need the properties that need to be updated
// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// app
// .route('/api/v1/tours')
// .get(getAllTours)
// .post(createTour);

// app
// .route('/api/v1/tours/:id')
// .get(getTour)
// .patch(updateTour)
// .delete(deleteTour);

// app
// .route('/api/v1/users')
// .get(getAllUsers)
// .post(createUser);

// app
// .route('/api/v1/users/:id')
// .get(getUser)
// .patch(updateUser)
// .delete(deleteUser);

// userRouter
// .route('/')
// .get(getAllUsers)
// .post(createUser);

// userRouter
// .route('/:id')
// .get(getUser)
// .patch(updateUser)
// .delete(deleteUser);


// const port = 3000
// app.listen(port, () => {
//     console.log(`App running on port ${port}...`);
// });

module.exports = app;

