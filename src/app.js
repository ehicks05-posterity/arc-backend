const morgan = require("morgan");
const express = require("express");
require("dotenv").config();
require("./apollo");
const jwt = require("express-jwt");
// const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");
const { createApolloServer } = require("./apollo");

const app = express();

// AUTH
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://hicks.us.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: "ehicks.net",
  issuer: [`https://hicks.us.auth0.com/`],
  algorithms: ["RS256"],

  credentialsRequired: false,
});
// END AUTH

app.use(morgan("dev"));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
// completely disable cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/", (req, res) => {
  res.send("See you at the party Richter!");
});
app.get("/me", checkJwt, (req, res) => {
  res.json({
    message: "Hello! This is an authenticated route.",
  });
});

app.use("/graphql", checkJwt);

async function startApolloServer() {
  const apolloServer = createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  );
}

startApolloServer();
