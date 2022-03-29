// Model Requires
const { selectArticleById } = require("../models/articles");

// Controller funcs
exports.getArticleById = async (req, res, next) => {
  try {
    // we need the parametric endpoint from req.params to insert into our model func
    const { article_id } = req.params;

    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
