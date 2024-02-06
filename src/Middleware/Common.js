const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            return res
                .status(400)
                .send({ status: false, message: "Please pass token" });
        }

        //decode token
        try {
            const decodedToken = jwt.verify(token, "book_management", {
            });
            req.decodedToken = decodedToken;
            req.userId=decodedToken.userId;
        } catch (error) {
            return res
                .status(401)
                .send({ status: false, message: "Authentication failed" });
        }
        console.log("authentication successful");
        
        next();

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};



module.exports = { authentication};