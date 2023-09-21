const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

// console.log(app.get('env')); // set by express
console.log(process.env.NODE_ENV); // set by node js

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

async function main() {
    try {
        await mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true}).then((con) => {
            // console.log(con);
            console.log('Connection succesful!');
        });
    } catch(err) {
        console.log(err);
    }
}

main();


const port = process.env.port || 8000
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});