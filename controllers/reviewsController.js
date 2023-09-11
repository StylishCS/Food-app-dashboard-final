const review = require("../services/reviewsServices");
const dishes = require("../services/dishesServices");
const { nanoid } =  require('nanoid');

exports.addReview = async (req, res) => {
  try {
    const dishe = await dishes.getDish(req.params.productId);
    if (!dishe.length > 0) {
      return res.status(404).json({ errors: ["Dish not found"] });
    }
    const nId = nanoid(10);
    const currentDate = new Date();
    const reviewObj = {
      id: nId,
      description: req.body.description,
      rating: req.body.rating,
      userId: req.params.userId,
      productId: req.params.productId,
      date: currentDate,
    };
    await review.createReview(reviewObj);
    res.status(200).json({
      msg: "Review created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await review.getReviews();
    if (!reviews[0]) {
      return res.status(404).json({ errors: ["reviews not found"] });
    }
    const currentDate = new Date();
    reviews.forEach((review) => {
      review.user_image = "http://" + req.hostname + ":3000/" + review.user_image;
      review.dish_image = "http://" + req.hostname + ":3000/" + review.dish_image;
      const reviewDate = new Date(review.date);
      const timeDifference = (currentDate - reviewDate) / 3600000; // Convert milliseconds to hours
      review.timeDifference = timeDifference;
    });
    return res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};
exports.getReview = async (req, res) =>{
  try {
    const reviews = await review.getReview(req.params.id);
    if (!reviews.length > 0) {
      return res.status(404).json({ errors: ["review not found"] });
    }
    reviews[0].user_image = "http://" + req.hostname + ":3000/" + reviews[0].user_image;
    reviews[0].dish_image = "http://" + req.hostname + ":3000/" + reviews[0].dish_image;
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
}
exports.deleteReview = async(req, res) =>{
  try {
    const reviews = await review.getReview(req.params.id);
    if (!reviews.length > 0) {
     return res.status(404).json({ errors: ["review not found"] });
    }
    await review.deleteReview(req.params.id);
   return res.status(200).json({ msg: "review Deleted successfully" });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
}

