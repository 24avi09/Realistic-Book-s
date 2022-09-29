const userModel = require("../models/userModels");
const bookModel = require("../models/bookModels");
const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");

const {
  isValidName,
  isValidRating,
  isValidDate,
} = require("../validation/validator");

////============================================================== create review =====================================================//////

const createReview = async function (req, res) {
  try {
    let BookId = req.params.bookId;
    let data = req.body;

    let { bookId, reviewedBy, reviewedAt, rating, review } = data;

    if (!mongoose.isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId" });
    }

    if (!mongoose.isValidObjectId(BookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId in params" });
    }

    if (BookId != bookId) {
      return res
        .status(400)
        .send({
          status: false,
          message: "bookId in params and body should be same is required",
        });
    }

    if (!BookId) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is required" });
    }

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "BookId is required" });
    }

    if (!reviewedAt) {
      return res
        .status(400)
        .send({ status: false, message: "reviewedAt is required" });
    }

    if (!rating) {
      return res
        .status(400)
        .send({ status: false, message: "rating is required" });
    }

    if (!isValidName(reviewedBy)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid reviewedBy" });
    }

    if (!isValidDate(reviewedAt)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid reviewedAt" });
    }

    if (!isValidRating(rating)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter rating from 1 to 5" });
    }

    if (!isValidName(review)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid review" });
    }

    if (!data.reviewedBy) {
      data.reviewedBy = "guest";
    }

    let createData = { ...data };

    let createReview = await reviewModel.create(createData);

    let getBook = await bookModel.findOne({
      _id: createReview.bookId,
      isDeleted: false,
    });

    if (!getBook) {
      return res.status(400).send({ status: false, message: "Book not exist" });
    }

    let updateBook = await bookModel
      .findOneAndUpdate(
        { _id: createReview.bookId, isDeleted: false },
        { $set: { reviews: getBook.reviews + 1 } },
        { new: true }
      )
      .select({ __v: 0, ISBN: 0 });

    if (!updateBook) {
      return res.status(400).send({ status: false, message: "Book not exist" });
    }

    let bookDetails = updateBook.toObject();
    let reviewDetails = createReview.toObject();

    let responseData = {
      ...bookDetails,
      reviewData: {
        _id: createReview._id,
        bookId: createReview.bookId,
        reviewedBy: createReview.reviewedBy,
        reviewedAt: createReview.reviewedAt,
        rating: createReview.rating,
        review: createReview.review,
      },
    };

    return res
      .status(201)
      .send({ status: false, message: "Book list", data: responseData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

////==================================================Update Review ========================================================/////

const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let { review, rating, reviewedBy } = req.body;

    if (!mongoose.isValidObjectId(req.params.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId" });
    }

    if (!mongoose.isValidObjectId(req.params.reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid reviewId" });
    }

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is required" });
    }

    if (!reviewId) {
      return res
        .status(400)
        .send({ status: false, message: "reviewId is required" });
    }

    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide any input to update" });
    }

    const bookData = await bookModel
      .findOne({ _id: bookId, isDeleted: false })
      .select({ __v: 0, ISBN: 0 });

    if (!bookData) {
      return res.status(404).send({ status: false, message: "Book not exist" });
    }

    const updatedReview = await reviewModel
      .findOneAndUpdate(
        { _id: reviewId, bookId: bookId, isDeleted: false },
        {
          $set: {
            review: review,
            rating: rating,
            reviewedBy: reviewedBy,
            reviewedAt: new Date(),
          },
        },
        { new: true }
      )
      .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 });

    if (!updatedReview) {
      return res
        .status(404)
        .send({ status: false, message: "Review not exist" });
    }

    let bookDetails = bookData.toObject();

    let reviewData = updatedReview.toObject();

    let responseData = { ...bookDetails, reviewData };

    return res
      .status(200)
      .send({ status: true, message: "book list", data: responseData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

////============================================================== delete review =====================================================//////

const deletReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide bookId" });
    }

    if (!mongoose.isValidObjectId(req.params.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId" });
    }

    if (!reviewId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide reviewId" });
    }

    if (!mongoose.isValidObjectId(req.params.reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid reviewId" });
    }

    const bookData = await bookModel
      .findOne({ _id: bookId, isDeleted: false })
      .select({ __v: 0, ISBN: 0 });

    if (!bookData) {
      return res.status(404).send({ status: false, message: "Book not exist" });
    }

    let deletReview = await reviewModel.findOneAndUpdate(
      { _id: reviewId, bookId: bookId, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!deletReview) {
      return res
        .status(404)
        .send({ status: false, message: "Review not Exist!" });
    }

    let updateBook = await bookModel
      .findOneAndUpdate(
        { _id: bookId, isDeleted: false },
        { $set: { reviews: bookData.reviews -1} }
      )

    return res
      .status(200)
      .send({ status: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

module.exports = { createReview, updateReview, deletReview };
