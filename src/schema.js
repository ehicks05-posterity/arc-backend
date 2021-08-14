const { makeSchema } = require("nexus");
const { types } = require("./api/index");

module.exports.schema = makeSchema({
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  types,
});
