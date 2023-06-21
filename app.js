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
    const connection = await mongoose.connect('mongodb+srv://dan:dan@studentzendashboard.gjd8l.mongodb.net/?retryWrites=true&w=majority')
    return connection
}

connectDb()
    .then(() => {
        server.listen(12000, () =>
            console.log("DB connection successfull\nserver running on " + 12000)
        );
    })
    .catch((err) => console.log("DB connection failed", err.message));
