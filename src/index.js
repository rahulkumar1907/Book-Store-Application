const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

app.use(bodyParser.json());

app.use('/', routes);

app.listen(3000, () => {
    console.log("app listen at port 3000");
});