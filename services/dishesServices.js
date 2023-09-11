const { connection } = require("../db/dbConnnection");
const util = require("util");

exports.add = async (data) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    await query("INSERT INTO dishes SET ?", [data]);
  } catch (error) {
    throw error;
  }
};

exports.getAll = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("SELECT * FROM dishes");
};

exports.getDish = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("SELECT * FROM dishes WHERE id = ?", [id]);
};

exports.updateDish = async (dishObj, id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("UPDATE dishes SET ? WHERE id = ?", [dishObj, id]);
};

exports.deleteDish = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("DELETE FROM dishes WHERE id = ?", [id]);
};
