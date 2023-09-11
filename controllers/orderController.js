const { nanoid } = require("nanoid");
const orderServices = require("../services/orderServices");

exports.createOrder = async (req, res) => {
  try {
    const id = nanoid(10);
    const orderData = {
      id: id,
      ...req.body,
    };
    const newOrder = await orderServices.createOrder(orderData);
    res.status(201).json({
      status: "success",
      msg: "order created successfully",
      data: { newOrder },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getProfit = async (req, res) => {
  try {
    const profitDetails = await orderServices.getProfitDetails();
    res.status(200).json({
        status: "success",
        msg: "profit details",
        data: { profitDetails },
        });
  } catch (error) {
    res.status(500).json({ error });
  }
};
