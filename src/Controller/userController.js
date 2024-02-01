const userModel = require('../Model/userModel');
const bcrypt = require("bcrypt");
let saltRounds = 10;
const registerUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) { return res.status(400).send({ status: false, error: "missing/invalid parameters" }); }
        const { username, email, password, role } = req.body;
        if (!username) { return res.status(400).send({ status: false, error: "missing/invalid parameters username" }); }
        if (!email) { return res.status(400).send({ status: false, error: "missing/invalid parameters email" }); }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) { return res.status(400).send({ status: false, error: "email format not correct" }); }
        if (!password) { return res.status(400).send({ status: false, error: "missing/invalid parameters password" }); }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) { return res.status(400).send({ status: false, error: "password should be minimum eight characters, at least one letter, one number, and one special character." }); }
        if (!role || !['author', 'admin', 'retailUser'].includes(role)) { return res.status(400).send({ status: false, error: "missing/invalid parameters role" }); }
        const isRegisterEmail = await userModel.findOne({ email: email });

        if (isRegisterEmail) return res.status(400).send({ status: false, message: "email already exist" });
        const encryptPassword = await bcrypt.hash(password, saltRounds);
        const userData = {
            username: username.trim(),
            email: email.trim(),
            role: role.trim(),
            password: encryptPassword
        };

        const createUser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "user registered successfully", data: createUser, });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: error.message });
    }
};
module.exports = { registerUser };