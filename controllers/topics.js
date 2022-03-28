const { selectTopics } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  const path = req.route.path;
  console.log(path);
  selectTopics(path)
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};
