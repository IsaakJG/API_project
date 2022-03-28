// Database Require
const db = require("../db/connection");

// Model Funcs
exports.selectTopics = (path) => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};
