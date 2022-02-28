const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        return res.send(users);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.post("/register", async (req, res) => {
    const newuser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    // const newuser = new User(req.body);

    try {
        const user = await newuser.save();
        res.send("User Registered Successfully");
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email, password: password });
        if (user) {
            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user._id,
            };
            res.send(temp);
        } else {
            return res.status(400).json({ message: "Login Failed" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;
