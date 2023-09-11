const { nanoid } = require("nanoid");
const { connection } = require("../db/dbConnnection");
const util = require("util");

exports.createOrder = async (order) => {
  const query = util.promisify(connection.query).bind(connection);
  const orderId = order.id;
  const orderData = {
    id: orderId,
    total: order.total,
    paymentMethod: order.paymentMethod,
    status: order.status,
    userId: order.userId,
    address: order.address,
  };
  await query("INSERT INTO orders SET ?", [orderData]);

  for (let i = 0; i < order.items.length; i++) {
    const orderItem = { orderId, ...order.items[i] };
    let orderItemId = nanoid(10);
    await query("INSERT INTO orderitems SET ?", [
      { id: orderItemId, orderId, ...order.items[i] },
    ]);
  }

  return order;
};

exports.getProfitDetails = async () => {
    const currentDayProfit = await getCurrentDayProfit();
    const pastDayProfit = await getPastDayProfit();
    const currentMonthProfit = await getCurrentMonthProfit();
    const pastMonthProfit = await getPastMonthProfit();
    const currentYearProfit = await getCurrentYearProfit();
    const pastYearProfit = await getPastYearProfit();
    
    return {
        currentDayProfit: currentDayProfit[0].current_day_profit,
        pastDayProfit: pastDayProfit[0].past_day_profit,
        currentMonthProfit: currentMonthProfit[0].current_month_profit,
        pastMonthProfit: pastMonthProfit[0].past_month_profit,
        currentYearProfit: currentYearProfit[0].current_year_profit,
        pastYearProfit: pastYearProfit[0].past_year_profit,
    };
}

const getCurrentDayProfit = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT SUM(total) AS current_day_profit FROM orders WHERE DATE_FORMAT(order_date, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d');"
  );
};

const getPastDayProfit = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT SUM(total) AS past_day_profit FROM orders WHERE DATE_FORMAT(order_date, '%Y-%m-%d') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY), '%Y-%m-%d');"
  );
};

const getCurrentMonthProfit = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT SUM(total) AS current_month_profit FROM orders WHERE DATE_FORMAT(order_date, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m');"
  );
};

const getPastMonthProfit = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT SUM(total) AS past_month_profit FROM orders WHERE DATE_FORMAT(order_date, '%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m');"
  );
};

const getCurrentYearProfit = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT SUM(total) AS current_year_profit FROM orders WHERE DATE_FORMAT(order_date, '%Y') = DATE_FORMAT(NOW(), '%Y');"
  );
};

const getPastYearProfit = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT SUM(total) AS past_year_profit FROM orders WHERE DATE_FORMAT(order_date, '%Y') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 YEAR), '%Y');"
  );
};
