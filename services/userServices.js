const { connection } = require("../db/dbConnnection");
const util = require("util");


exports.getAllAdmins = async () => {
    const query = util.promisify(connection.query).bind(connection);
    const adminCountResult = await query("SELECT COUNT(*) AS adminCount FROM users WHERE role = 'ADMIN'");
    const activeCountResult = await query("SELECT COUNT(*) AS activeCount FROM users WHERE role = 'ADMIN' AND status = 'ACTIVE'");
  
    const numOfAdmins = adminCountResult[0].adminCount;
    const numOfActive = activeCountResult[0].activeCount;
  
    return { numOfAdmins, numOfActive };
  }


exports.editProfile = async (data, id) => {
    const query = util.promisify(connection.query).bind(connection);
    return await query("UPDATE users SET ? WHERE id = ?", [data, id]);
  };

exports.getAdmin = async (id) => {
    const query = util.promisify(connection.query).bind(connection);
    return await query("SELECT * FROM users WHERE id = ?", [id]);
}

exports.changeStatus = async (id,status) => {
    const query = util.promisify(connection.query).bind(connection);
    await query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
}