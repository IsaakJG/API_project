const express = require("express");
const app = express();
app.use(express.json());

// Controller Requires
const { getTopics } = require("./controllers/topics");
const {
  getArticleById,
  patchArticleById,
  getCommentsByArticleId,
  getArticles,
  postCommentsByArticleId,
} = require("./controllers/articles");
const { getUsers } = require("./controllers/users");

// GET Endpoints
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);

//PATCH Endpoints
app.patch("/api/articles/:article_id", patchArticleById);

//POST Endpoints
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

// PSQL Error Handling
app.use((err, req, res, next) => {
  const badReqCodes = ["22P02", "23502", "23503"];
  //   if (badReqCodes.includes(err.code)) {
  //     res.status(400).send({ message: "Bad request" });
  //   } else {
  //     next(err);
  //   }

  if (err.code === "23503") {
    res.status(400).send({ message: "Bad request - username does not exist" });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Bad request - invalid key name" });
  } else if (badReqCodes.includes(err.code)) {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});

// Custom Error Handling
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

//Route Not Found Error Handling
app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

// Internal Server Error handling
app.use((err, req, res, next) => {
  console.log(err, "<<----- err");
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
