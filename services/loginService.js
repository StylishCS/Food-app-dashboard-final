const { connection } = require("../db/dbConnnection");
const util = require("util");
const bcrypt = require("bcrypt");

async function getUser(email, password) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const getUser = await query("select * from users where email = ?", [email]);
    // console.log(getUser);
    if (getUser.length <= 0) {
      return {
        msg: "The email address or mobile number you entered isn't connected to an account.",
        status: 404,
      };
    }
    return getUser;
  } catch (error) {
    console.error(error);
  }
}

async function isVerified(email) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const verified = await query("select verified from users where email = ?", [
      email,
    ]);
    return verified;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getUser, isVerified };
