const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    guildId: String,
    tickets: Array
});

module.exports = mongoose.model("ticket", schema);

