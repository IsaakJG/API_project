// Database Require
const db = require("../db/connection");

// Model Funcs
exports.selectTopics = async () => {
  const result = await db.query("SELECT * FROM topics;");
  return result.rows;
};
