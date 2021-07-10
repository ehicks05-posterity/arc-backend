const { makeSchema } = require("nexus");
const { types } = require("../src/api2/index");

module.exports.schema = makeSchema({
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  types,
});
