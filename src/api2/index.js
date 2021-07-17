const { DateTime } = require("./Datetime");
const PostTypes = require("./Post");
const CommentTypes = require("./Comment");
const UserTypes = require("./User");

module.exports.types = {
  DateTime,
  ...PostTypes,
  ...CommentTypes,
  ...UserTypes,
};
