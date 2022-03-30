const express = require("express");
const app = express();
app.use(express.json());

// Controller Requires
const { getTopics } = require("./controllers/topics");
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/articles");
const { getUsers } = require("./controllers/users");

// GET Endpoints
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);

//PATCH Endpoints
app.patch("/api/articles/:article_id", patchArticleById);

// PSQL Error Handling
app.use((err, req, res, next) => {
  const badReqCodes = ["22P02"];
  if (badReqCodes.includes(err.code)) {
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
