

const isValidName = function (body) {
  const nameRegex = /^[a-zA-Z_!@#$%^&*()_+?"|:<>/.,;'} ]*$/;
  return nameRegex.test(body);
};

const isValidStreet = function (body) {
  const nameRegex = /^[a-zA-Z0-9_ ]*$/;
  return nameRegex.test(body);
};

const isValidEmail = function (email) {
  return /^[a-z0-9._+~!@#$%^&:;"',<.>?/}{*()]+@[a-z-]+\.[a-z-.]+$/.test(email);
};

const isValidMobileNo = function (mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

const isValidPassword = function (Password) {
  const passRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
  return passRegex.test(Password);
};

const isValidPincode = function (Pincode) {
  const passRegex = /^[1-9][0-9]{5}$/;
  return passRegex.test(Pincode);
};

const isValidISBN = function (ISBN) {
  const passRegex = /^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/;
  return passRegex.test(ISBN);
};

const isValidReviews = function (review) {
  const nameRegex = /^[0-9]+$/;
  return nameRegex.test(review);
};

const isValidDate = function (date) {
  const nameRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
  return nameRegex.test(date);
};

const isValidRating = function (rating) {
  const nameRegex = /^[1-5]+$/;
  return nameRegex.test(rating);
};



module.exports = {
  isValidName,
  isValidEmail,
  isValidMobileNo,
  isValidTitle,
  isValidPassword,
  isValidPincode,
  isValidISBN,
  isValidReviews,
  isValidDate,
  isValidRating,
  isValidStreet
};
