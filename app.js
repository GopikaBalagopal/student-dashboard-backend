const express = require("express");
const cors = require("cors");
const http = require('http');
const mongoose = require("mongoose")
let app = express();
const server = http.createServer(app); // Create a new HTTP server instance
const routes = require('./api')

app.use(cors()); // Enable CORS for the Express app
app.use(express.json());
app.use('/api', routes)

const connectDb = async () => {
    const connection = await mongoose.connect('mongodb+srv://kvgopikabalagopal:mitju8-fiJnun-ryqpyt@gopika.glzahb7.mongodb.net/')
    return connection
}

connectDb()
    .then(() => {
        server.listen(12000, () =>
            console.log("DB connection successfull\nserver running on " + 12000)
        );
    })
    .catch((err) => console.log("DB connection failed", err.message));
