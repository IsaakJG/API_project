// Database connection require
const db = require("../db/connection");

exports.removeCommentById = async (comment_id) => {
  // First checking the comment is in the database or not, then checking that within an if statement
  const result = await db.query(
    "SELECT * FROM comments WHERE comment_id = $1",
    [comment_id]
  );

  if (result.rows.length) {
    return db
      .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
      .then(() => {});
  } else {
    return Promise.reject({ status: 404, message: "Invalid comment_id" });
  }
};
