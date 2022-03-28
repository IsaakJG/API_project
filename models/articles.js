// Database Require
const db = require("../db/connection");

// Model Funcs
exports.selectArticleById = async (article_id) => {
  const result = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [article_id]
  );
  if (result.rows.length) {
    return result.rows[0];
  } else {
    return Promise.reject({ status: 404, message: "Invalid article ID" });
  }
};
