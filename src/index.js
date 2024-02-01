const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());


app.listen(3000, () => {
    console.log("app listen at port 3000");
});