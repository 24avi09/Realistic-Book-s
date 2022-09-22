const userModel = require("../models/userModels");
const bookModel = require("../models/bookModels");
const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");

const {
  isValidName,
  isValidISBN,
  isValidReviews,
  isValidDate
} = require("../validation/validator");
const { findByIdAndUpdate } = require("../models/userModels");

///////==================================================  Creating Book =================================================================/////////
const createBook = async function (req, res) {
  try {
    let data = req.body;
    let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt, deletedAt } = data;

    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "title is required" });
    }
    if (!excerpt) {
      return res
        .status(400)
        .send({ status: false, message: "excerpt is required" });
    }
    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "userId is required" });
    }
    if (!ISBN) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN is required" });
    }
    if (!category) {
      return res
        .status(400)
        .send({ status: false, message: "category is required" });
    }
    if (!subcategory) {
      return res
        .status(400)
        .send({ status: false, message: "subCategory is required" });
    }
    if (!releasedAt) {
      return res
        .status(400)
        .send({ status: false, message: "releasedAt is required" });
    }

    //------type validation----//

    if (!isValidName(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid title" });
    }

    const isTitleAlreadyUsed = await bookModel.findOne({ title });

    if (isTitleAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: `title is already registered` });
    }

    if (!isValidName(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid excerpt" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid userId" });
    }

    const isValidUser = await userModel.findOne({ _id: userId });

    if (!isValidUser) {
      return res
        .status(400)
        .send({ status: false, message: `User not exist` });
    }

    if (!isValidISBN(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid ISBN" });
    }

    const isIsbnAlreadyUsed = await bookModel.findOne({ ISBN });

    if (isIsbnAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: `ISBN is already registered` });
    }

    if (!isValidName(category)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid category" });
    }

    if (!isValidName(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid subcategory" });
    }

    if (!isValidDate(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid releasedAt" });
    }

    //-------- extra----------//
    if (reviews) {
      if (!isValidReviews(reviews)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid reviews" });
      }
    }

    if (deletedAt) {
      if (!isValidDate(deletedAt)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid deletedAt" });
      }
    }


    let saveddata = await bookModel.create(data);

    return res
      .status(201)
      .send({ status: true, message: "success", data: saveddata });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};




//////////=============================================== fetching book details by query ===========================================================/////////////

const getBooks = async function (req, res) {
  try {
    let data = req.query;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide any Query Input" });
    }

    if (req.query.userId) {
      if (!mongoose.isValidObjectId(req.query.userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid userId" });
      }
    }

    let obj = { isDeleted: false, ...data };

    let books = await bookModel
      .find(obj)
      .select("_id title excerpt userId category releasedAt reviews");

    if (books.length == 0) {
      return res.status(404).send({ status: false, message: "No Book Found" });
    }

    let booksData = books.sort(function (a, b) {
      return a.title - b.title;
    });

    return res
      .status(200)
      .send({ status: true, message: "Book List", data: booksData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};





////===================================================  fetching book details by params (bookId)  ========================================================//////

const getBooksParams = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!mongoose.isValidObjectId(req.params.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId" });
    }

    const bookData = await bookModel
      .findById({ _id: bookId, isDeleted: false })
      .select({ ISBN: 0 });

    if (!bookData) {
      return res.status(404).send({ status: false, message: "Book not exist" });
    }
    let bookDetails = bookData.toObject();

    const reviewData = await reviewModel.find({
      bookId: bookId,
      isDeleted: false,
    });

    let data = { ...bookDetails, review: reviewData };

    return res
      .status(200)
      .send({ status: true, message: "Book List", data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};




const updateBook = async function (req, res) {
  try {

    let bookId = req.params.bookId
    let data = req.body
    let { title, excerpt, releasedAt, ISBN } = data

    if (!mongoose.isValidObjectId(req.params.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId" });
    }

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide any input to update" });
    }

    const isTitleAlreadyUsed = await bookModel.findOne({ title })

    if (isTitleAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: `title is already registered` });
    }

    const isIsbnAlreadyUsed = await bookModel.findOne({ ISBN });

    if (isIsbnAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: `ISBN is already registered` });
    }

    const update = await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      {
        $set: {
          title: title,
          excerpt: excerpt,
          releasedAt: releasedAt,
          ISBN: ISBN
        }
      },
      { new: true }
    )

    if (!update) {
      return res.status(404).send({ status: false, message: "Book not exist" });
    }



    return res
      .status(200)
      .send({ status: true, message: "Book List", data: update });


  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
}


let deletbook = async function (req, res) {
  try {
    let bookId = req.params.bookId

    if (!bookId) { return res.status(400).send({ status: false, message: "please provide bookId" }) }

    if (!mongoose.isValidObjectId(req.params.bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid bookId" });
    }


    let bookD = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

    if (!bookD) {
      return res
        .status(404)
        .send({ status: false, message: "Book not exist" });

    }

    return res.status(200).send({ status: true, message: "Deleted Seccessfully!" })



  } catch (error) {

    res.status(500).send({ status: false, message: error })

  }
}



module.exports = { createBook, getBooks, getBooksParams, updateBook, deletbook };
