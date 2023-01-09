const mongoose = require("mongoose");

class Mongoose {
    constructor() {}
    /**
     * @param {string} MongoUrl 
     */
    connect(MongoUrl) {
        mongoose.set('strictQuery', false);
        return mongoose.connect(MongoUrl);
    }
}

module.exports.Mongoose = Mongoose;