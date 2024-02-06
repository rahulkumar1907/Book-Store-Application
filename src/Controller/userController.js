const userModel = require('../Model/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let saltRounds = 10;

const registerUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) { return res.status(400).send({ status: false, error: "missing/invalid parameters" }); }
        const { username, email, password, role } = req.body;
        if (!username) { return res.status(400).send({ status: false, error: "missing/invalid parameters username" }); }
        if (!email) { return res.status(400).send({ status: false, error: "missing/invalid parameters email" }); }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) { return res.status(400).send({ status: false, error: "email format not correct" }); }
        if (!role || !['author', 'admin', 'retailUser'].includes(role)) { return res.status(400).send({ status: false, error: "missing/invalid parameters role" }); }
        if (!password) { return res.status(400).send({ status: false, error: "missing/invalid parameters password" }); }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) { return res.status(400).send({ status: false, error: "password should be minimum eight characters, at least one letter, one number, and one special character." }); }
        const isRegisterEmail = await userModel.findOne({ email: email });

        if (isRegisterEmail) return res.status(400).send({ status: false, message: "email already exist" });
        const encryptPassword = await bcrypt.hash(password, saltRounds);
        const userData = {
            username: username.trim(),
            email: email.trim().toLowerCase(),
            role: role.trim().toLowerCase(),
            password: encryptPassword
        };

        const createUser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "user registered successfully", data: createUser, });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

//to login user
const userLogin = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) { return res.status(400).send({ status: false, error: "missing/invalid parameters" }); }

        const { email, password } = req.body;
        if (!email) { return res.status(400).send({ status: false, error: "missing/invalid parameters email" }); }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) { return res.status(400).send({ status: false, error: "email format not correct" }); }
        if (!password) { return res.status(400).send({ status: false, error: "missing/invalid parameters password" }); }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) { return res.status(400).send({ status: false, error: "password should be minimum eight characters, at least one letter, one number, and one special character." }); }
        const isEmailExists = await userModel.findOne({ email: email });
        if (!isEmailExists) return res.status(401).send({ status: false, message: "incorrect email" });



        const isPasswordMatch = await bcrypt.compare(password, isEmailExists.password);

        if (!isPasswordMatch) return res.status(401).send({ status: false, message: "incorrect password" });


        const token = jwt.sign(
            { userId: isEmailExists._id.toString() },
            "book_management",
            { expiresIn: '24h' }
        );

        let result = {
            userId: isEmailExists._id.toString(),
            token: token,
        };

       return res.status(200).send({ status: true, message: "login successfull", data: result });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = { registerUser, userLogin };