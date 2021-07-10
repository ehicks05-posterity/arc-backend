const morgan = require("morgan");

require("dotenv").config();

const express = require("express");

const postsRoutes = require("./api/posts");
const commentsRoutes = require("./api/comments");
const usersRoutes = require("./api/users");

const app = express();

require("./apollo");

// AUTH
const jwt = require("express-jwt");
// const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

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
  console.log("yo");
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});
app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", usersRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
