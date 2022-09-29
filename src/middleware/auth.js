const JWT = require("jsonwebtoken")
const bookModel = require("../models/bookModels");
const mongoose = require("mongoose");



const authentication = async function (req, res, next) {
    try {
        let token = req.header('x-api-key')
        if (!token) { return res.status(400).send({ status: false, message: "Token must be present" }) }

        JWT.verify(token, "keep-it-secret-tillThe-endOf-Course", function (error, decodedToken) {
            if (error) {
                 res.status(401).send({ status: false, message: "Unauthenticated access (Invalid Token)" })
            } else {
                req.token = decodedToken
                next()
            }
        })


    } catch (error) {
        res.status(500).send({ status: false, message: error.msg })
    }

}


const Authorisation = async function (req, res, next) {
    try {

    
        let bookId = req.params.bookId;

        if (!bookId) {
            return res
              .status(400)
              .send({ status: false, message: "please provide bookId" });
          }
    

        if (!mongoose.isValidObjectId(bookId)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter valid bookId" });
          }

        let bookD = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookD) {
            return res.status(404).send({ status: false, message: `Book not exist` })
        }

        if (bookD.userId.toString() !== req.token.UserId) {
            return res.status(403).send({ status: false, message: `Unauthorized access!` });
        }

        next()

    } catch (error) {

        return res.status(500).send({ status: false, message: error })
    }

}

module.exports = { authentication,Authorisation }