const { connection } = require("../db/dbConnnection");
const util = require("util");

exports.getNewCustomers = async () => {
  const query = util.promisify(connection.query).bind(connection);
  const customers = await query(
    "SELECT userId, COUNT(*) AS order_count FROM orders GROUP BY userId HAVING COUNT(*) = 1;"
  );
  return customers.length;
};

exports.getOldCustomers = async () => {
  const query = util.promisify(connection.query).bind(connection);
  const customers = await query(
    "SELECT userId, COUNT(*) AS order_count FROM orders GROUP BY userId HAVING COUNT(*) > 1;"
  );
  return customers.length;
};

exports.getComeCustomers = async () => {
  const query = util.promisify(connection.query).bind(connection);
  const customers = await query(
    "SELECT userId FROM orders WHERE order_date <= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH);"
  );
  return customers.length;
};

exports.getAllCustomers = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("select id from users where role = 'USER'")
}
