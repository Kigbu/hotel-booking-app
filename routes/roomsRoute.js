const express = require("express");
const router = express.Router();
const Room = require("../models/room");

router.post("/addroom", async (req, res) => {
    const newroom = new Room({
        name: req.body.name,
        rentperday: req.body.rentperday,
        maxcount: req.body.maxcount,
        description: req.body.description,
        phonenumber: req.body.phonenumber,
        type: req.body.type,
        imageurls: req.body.imageurls,
    });

    // const newuser = new User(req.body);

    try {
        const room = await newroom.save();
        res.send("Room Created Successfully");
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find({});
        return res.send(rooms);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.get("/:id", async (req, res) => {
    // console.log()
    // process.stdout.write(req.params.id);
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).send("Room not Found");

    res.send(room);
    // try {
    //     const room = await Room.findById(req.params.id);
    //     console.log(room);
    //     return res.send(room);
    // } catch (error) {
    //     return res.status(400).json({ message: error });
    // }
});

module.exports = router;
