const mongoose = require("mongoose");

var mongoURL =
    "mongodb+srv://kigbu_atlas:kigbua@cluster0.n8fdc.mongodb.net/wiserooms";

mongoose.connect(
    mongoURL,
    { useUnifiedTopology: true },
    { useNewUrlParser: true }
);

var connection = mongoose.connection;
connection.on("error", () => {
    console.log("Mongo DB connection failed");
});

connection.on("connected", () => {
    console.log("Mongo DB connection successful");
});

module.exports = mongoose;
