const mongoose = require('mongoose');
const bookModel = require('../Model/bookModel');
const reviewModel = require('../Model/reviewModel');

const createReview = async function (req, res) {
  try {
    //reading bookid from path
    const _id = req.params.bookId;

    //id format validation
    if (!_id) {
        return res
          .status(400)
          .send({ status: false, message: "bookId Invalid" });
      }
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) === false) {
        return res
          .status(400)
          .send({ status: false, message: "bookId Invalid" });
      }
    }

    //fetch book with bookId
    const book = await bookModel.findOne({
      $and: [{ _id }, { isDeleted: false }],
    });

    //no books found
    if (!book) {
      return res.status(404).send({ status: false, message: "book not found" });
    }
    if (book.authors.includes(req.userId)) {
        return res.status(401).send({ status: false, message: "not authorised to give review on book created by you" });
      }

    //reading request body
    const body = req.body;
    const { rating } = body;

    let arr = Object.keys(body);

    //if empty request body
    if (arr.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide input" });
    }

    //mandatory fields

    if (!rating) {
      return res
        .status(400)
        .send({ status: false, message: "rating is required" });
    }

    //rating validation
    // const validRating = /^([1-5]|1[5])$/.test(rating);
    const validRating = /^([1-4](\.\d{1,2})?|5(\.0{1,2})?)$/.test(rating);

    if (!validRating) {
      return res.status(400).send({
        status: false,
        message: "Invalid rating - rating should be a Number between 1 to 5",
      });
    }

    //assign bookId from path
    body.bookId = _id;
    body.reviewedBy=req.userId 
    body.reviewedAt=new Date()
    // now body also contain book id which is ref of book in review schema
    //create review
    const review = await reviewModel.create(body);
    const updatedBook = await bookModel
      .findByIdAndUpdate({ _id }, { $inc: { reviews: 1 } }, { new: true })
      .lean(); //unfreeze doc.

    updatedBook.reviewsData = review;

   return res.status(201).send({ status: true, message: "Success", data: updatedBook });
  } catch (err) {
   return res.status(500).send({status: false,error: "Server not responding",message: err.message,
    });
  }
};

module.exports={createReview}