// Model Requires
const {
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  selectArticles,
  insertCommentByArticleId,
} = require("../models/articles");

// Controller funcs
exports.getArticles = async (req, res, next) => {
  try {
    const articles = await selectArticles();
    res.send({ articles });
  } catch (err) {
    next(err);
  }
};

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

exports.postCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { username } = req.body;
    const { body } = req.body;
    const result = await insertCommentByArticleId(article_id, username, body);
    res.status(201).send({ comment: result });
  } catch (err) {
    next(err);
  }
};
