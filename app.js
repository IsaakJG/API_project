const express = require("express");
const app = express();
app.use(express.json());

// Controller Requires
const { getTopics } = require("./controllers/topics");

//Endpoints
app.get("/api/topics", getTopics);

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
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
