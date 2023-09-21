const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({path: './config.env'});

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours); 
        console.log('Data Successfully loaded');
    } catch(err) {
        console.log(err);
    }
    process.exit();
}

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted');
    } catch(err) {
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete') {
    deleteData();
}

