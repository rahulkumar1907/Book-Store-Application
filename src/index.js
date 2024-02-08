const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

app.use(bodyParser.json());
const dbURI = "mongodb+srv://rahulkumar:9996262236@cluster0.jdea1mv.mongodb.net/book-management";

mongoose.connect(dbURI).then(() => {
    console.log("Mongo db is connected");
}).catch((err) => {
    console.log("Error in mongo db connection", err.message);
});
app.use('/', routes);

app.listen(3000, () => {
    console.log("app listen at port 3000");
});