const userModel = require("../models/userModels");
const JWT = require("jsonwebtoken");

const {
  isValidName,
  isValidPassword,
  isValidEmail,
  isValidTitle,
  isValidMobileNo,
  isValidPincode,
  isValidStreet,
} = require("../validation/validator");

const registerUser = async function (req, res) {
  try {
    const data = req.body;

    const { title, name, phone, email, password, address } = { ...data };
    const { street, city, pincode } = { ...address };

    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "title is required" });
    }

    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "name is required" });
    }

    if (!phone) {
      return res
        .status(400)
        .send({ status: false, message: "phone is required" });
    }

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (address) {
      if (typeof address !== "object") {
        return res
          .status(400)
          .send({ status: false, message: "address must be type object" });
      }
    }

    if (!isValidTitle(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid title" });
    }

    if (!isValidName(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid name" });
    }

    if (!isValidMobileNo(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid phone number" });
    }

    const isPhoneAlreadyUsed = await userModel.findOne({ phone });

    if (isPhoneAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: "phone already exist" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email" });
    }

    const isEmailAlreadyUsed = await userModel.findOne({ email });

    if (isEmailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: "email already exist" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Enter a valid password (min-8,max-15, contains atleast one num and symbol each, Have a mixuture of uppercase and lowercase letters)",
      });
    }

    if (address) {
      if (!isValidStreet(street)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid street" });
      }

      if (!isValidName(city)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid city" });
      }

      if (!isValidPincode(pincode)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid pincode" });
      }
    }

    const createUser = await userModel.create(data);

    return res
      .status(201)
      .send({ status: true, message: "Success", data: createUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

////=========================================login=======================================////

const userLogin = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!(email && password)) {
      return res
        .status(400)
        .send({ status: false, message: "Email and Password are Mandatory " });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Enter a valid password (min-8,max-15, contains atleast one num and symbol each, Have a mixuture of uppercase and lowercase letters)",
      });
    }

    let userDetail = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!userDetail)
      return res
        .status(400)
        .send({ status: false, message: "Incorrect UserName or Password." });

    let Payload = {
      UserId: userDetail._id.toString(),
      EmailID: userDetail.email,
      Batch: "Plutonium",
      Group: "3",
      Project: "project-booksManagementementGroup3",
    };
    let token = JWT.sign(Payload, "keep-it-secret-tillThe-endOf-Course", {
      expiresIn: "1d",
    });

    res.setHeader("x-api-key", token);
    return res.status(200).send({ status: true, message: "Success", data: { token } });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { registerUser, userLogin };
