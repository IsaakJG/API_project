// Database Require
const db = require("../db/connection");

// Model Funcs
exports.selectArticles = async () => {
  const result = await db.query(
    `SELECT articles.*, COUNT(comments.article_id)::INTEGER 
    AS comment_count
    FROM comments
    RIGHT JOIN articles
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id;`
  );
  return result.rows;
};

exports.selectArticleById = async (article_id) => {
  const result = await db.query(
    `SELECT articles.*, 
    COUNT(comments.article_id)::INT AS comment_count 
    FROM comments
    LEFT JOIN articles
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [article_id]
  );
  if (result.rows.length) {
    return result.rows[0];
  } else {
    return Promise.reject({ status: 404, message: "Invalid article ID" });
  }
};

exports.updateArticleById = async (article_id, newArticle) => {
  const { inc_votes } = newArticle;

  if (inc_votes) {
    // want to check if inc_votes is truthy and if so run the db.query, if not on line 32 we will reject the promise with 400
    const result = await db.query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    );
    // now to check whether the we get anything back from the truth query (an empty array or not), if not we send back a 404 error and if so, we send back the results.
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Invalid article ID" });
    } else {
      return result.rows[0];
    }
  } else {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
};
