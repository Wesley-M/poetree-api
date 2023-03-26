import "./loadEnvironment.mjs";
import express from 'express';
import poems from "./routes/poems.mjs";
import connectDB from './db/conn.mjs';

// Environment variables
const PORT = process.env.PORT || 3000;

// Create Express app
const app = express();

// Connect to MongoDB and start listening
connectDB().then(() => {
    app.listen(PORT, function () {
        console.log("Listening on port " + PORT);
    })
});

app.use(express.json());
app.use("/poems", poems);
