const { GraphQLDateTime } = require("graphql-scalars");
const { asNexusMethod } = require("nexus");

module.exports.DateTime = asNexusMethod(GraphQLDateTime, "DateTime");
