const { connection } = require("../db/dbConnnection");
const util = require("util");

exports.getReviews = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT reviews.description, reviews.date, reviews.rating, AVG(reviews.rating) AS average_rating, users.image AS user_image, users.fullname, dishes.image AS dish_image FROM reviews JOIN users ON reviews.userId = users.id JOIN dishes ON reviews.productId = dishes.id GROUP BY reviews.description, reviews.rating, users.image, users.fullname, dishes.image;"
  );
};

exports.getReview = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT reviews.description, reviews.rating, AVG(reviews.rating) AS average_rating, users.image AS user_image, users.fullname, dishes.image AS dish_image FROM reviews JOIN users ON reviews.userId = users.id JOIN dishes ON reviews.productId = dishes.id WHERE reviews.id = ? GROUP BY reviews.description, reviews.rating, users.image, users.fullname, dishes.image",
    [id]
  );
};
exports.deleteReview = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  await query("delete from reviews where id = ?", [id]);
};

exports.createReview = async (data) => {
  const query = util.promisify(connection.query).bind(connection);
  await query("insert into reviews set ?", [data]);
};
