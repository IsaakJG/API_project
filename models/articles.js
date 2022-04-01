// Database Require
const db = require("../db/connection");

// Model Funcs
exports.selectArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  // First off defining our valid coloumn and order queries, as well as setting up an array for potential query values.
  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC"];
  const validTopics = [
    "mitch",
    "cats",
    "paper",
    "coding",
    "football",
    "cooking",
  ];
  const queryValues = [];

  // Also setting up our baseline query
  let queryStr = `SELECT articles.*, COUNT(comments.article_id)::INTEGER 
  AS comment_count
  FROM comments
  RIGHT JOIN articles
  ON articles.article_id = comments.article_id`;

  // Checking whether the client has given us a valid sort_by and order query
  if (!validColumns.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({
      status: 400,
      message: "Invalid column name or order",
    });
  }

  // Now to check whether the client has given us a topic to filter by, if so we need to push that to our queryValues array and add the final line to our string.
  if (validTopics.includes(topic)) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  // The next line is then always goign to be GROUP BY...
  queryStr += ` GROUP BY articles.article_id`;

  // When the if statemnt passes, add this string to the query
  queryStr += ` ORDER BY ${sort_by} ${order};`;

  const result = await db.query(queryStr, queryValues);
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

exports.selectCommentsByArticleId = async (article_id) => {
  const commentsResult = await db.query(
    `SELECT * FROM comments WHERE article_id = $1;`,
    [article_id]
  );

  if (commentsResult.rows.length) {
    return commentsResult.rows;
  } else {
    return Promise.reject({
      status: 404,
      message: "Article ID's comments not found",
    });
  }
};

exports.insertCommentByArticleId = async (article_id, username, body) => {
  const insertComment = await db.query(
    `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
    [article_id, username, body]
  );
  return insertComment.rows[0];
};
