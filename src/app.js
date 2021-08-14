const morgan = require("morgan");
const express = require("express");
require("dotenv").config();
require("./apollo");
const jwt = require("express-jwt");
const { createApolloServer } = require("./apollo");
const { scheduleUpdateScoresProcedure } = require("./tasks");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

// AUTH
const checkJwt = jwt({
  secret: process.env.SUPABASE_JWT_SECRET,
  credentialsRequired: false,
  // Validate the audience and the issuer.
  audience: "authenticated",
  // issuer: [`https://hicks.us.auth0.com/`],
  algorithms: ["HS256"],
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
    user: req.user,
  });
});

app.use(checkJwt, async (req, res, next) => {
  if (req.user) {
    console.log(req.user.sub);
    const id = req.user.sub;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      console.log(`incoming user ${id} is missing from db. creating...`);
      await prisma.user.create({ data: { id, username: id } });
    }
  }
  next();
});

app.use("/graphql", checkJwt);

const port = process.env.NODE_ENV === "production" ? process.env.PORT : 4000;
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`process.env.PORT: ${process.env.PORT}`);

async function startApolloServer() {
  const apolloServer = createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  await new Promise((resolve) => app.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );

  scheduleUpdateScoresProcedure();
}

startApolloServer();
