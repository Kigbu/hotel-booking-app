const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const moment = require("moment");
const stripe = require("stripe")("secret_key");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays, token } =
        req.body;

    // try {
    //     const customer = await stripe.customers.create({
    //         email: token.email,
    //         source: token.id,
    //     });

    //     const payment = await stripe.charges.create(
    //         {
    //             amount: totalamount * 100,
    //             customer: customer.id,
    //             currency: "USD",
    //             receipt_email: token.email,
    //         },
    //         { idempotencyKey: uuidv4() }
    //     );

    //     if (payment) {
    //         // save bookings to DB
    //     }
    //     res.send("Payment successful, Your room is booked");
    // } catch (error) {}

    try {
        const booking = new Booking({
            room: room.name,
            roomid: room._id,
            userid,
            fromdate: moment(fromdate).format("DD-MM-YYYY"),
            todate: moment(todate).format("DD-MM-YYYY"),
            totalamount,
            totaldays,
            transactionId: "1234556789",
        });
        await booking.save();
        const roombooking = await Room.findById({ _id: room._id });
        roombooking.currentbookings.push({
            bookingid: booking._id,
            fromdate: moment(fromdate).format("DD-MM-YYYY"),
            todate: moment(todate).format("DD-MM-YYYY"),
            userid: userid,
            status: booking.status,
        });

        await roombooking.save();

        res.send(booking);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const bookings = await Booking.findById(req.params.id);
        res.send(bookings);
    } catch (error) {
        return res.status(404).send("Book Details not Found");
    }
});

router.get("/userbookings/:userid", async (req, res) => {
    try {
        const bookings = await Booking.find({ userid: req.params.userid });
        res.send(bookings);
    } catch (error) {
        return res.status(400).send("Book Details not Found");
    }
});

router.post("/cancelbooking", async (req, res) => {
    const { bookingid, roomid } = req.body;
    try {
        const booking = await Booking.findOne({ _id: bookingid });
        booking.status = "cancelled";
        await booking.save();
        const room = await Room.findOne({ _id: roomid });
        const bookings = room.currentbookings;
        const temp = bookings.filter(
            (booking) => booking.bookingid.toString() !== bookingid
        );
        room.currentbookings = temp;
        await room.save();
        res.send("Your Bookings was succesfully cancelled");
    } catch (error) {
        return res.status(400).send({ error });
    }
});

module.exports = router;
