// Model Requires
const {
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
} = require("../models/articles");

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

exports.patchArticleById = async (req, res, next) => {
  try {
    // we now need both the article_id from the params and now the .send from the body to put within our model function
    const { article_id } = req.params;
    const newArticle = req.body;

    const updatedArticle = await updateArticleById(article_id, newArticle);
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const result = await selectCommentsByArticleId(article_id);

    res.send({ comments: result });
  } catch (err) {
    next(err);
  }
};
