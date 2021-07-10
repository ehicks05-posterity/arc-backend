const { GraphQLDateTime } = require("graphql-iso-date");
const { asNexusMethod } = require("nexus");

module.exports.DateTime = asNexusMethod(GraphQLDateTime, "DateTime");
