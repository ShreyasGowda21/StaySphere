const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Hotel", hotelSchema);