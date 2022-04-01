//Model requires
const { removeCommentById } = require("../models/comments");

exports.deleteCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const result = await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
