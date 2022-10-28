const express = require('express')
const router = express.Router()
const { registerUser, userLogin } = require("../controller/userController")
const { createBook, getBooks, getBooksParams, updateBook, deletbook } = require("../controller/bookController")
const{ authentication, Authorisation }=require("../middleware/auth")
const{ createReview, updateReview ,deletReview}=require("../controller/reviewController")


//------user apis--------//

router.post("/register", registerUser)

router.post("/login", userLogin)


//------book apis--------//

router.post("/books",authentication,createBook)

router.get("/books",authentication,getBooks)

router.get("/books/:bookId",authentication, getBooksParams )

router.put("/books/:bookId",authentication,Authorisation, updateBook )

router.delete("/books/:bookId",authentication,Authorisation, deletbook )


//------review apis--------//

router.post("/books/:bookId/review", createReview )

router.put("/books/:bookId/review/:reviewId", updateReview )

router.delete("/books/:bookId/review/:reviewId", deletReview )

module.exports = router