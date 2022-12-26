const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        ref: "Book",
        required: true,
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest",
    },
    reviewedAt: {
        type: Date,
        required: true,
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        optional: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },


}, { timestamps: true });


module.exports = mongoose.model("Review", reviewSchema);
