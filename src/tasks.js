const schedule = require("node-schedule");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.scheduleUpdateScoresProcedure = () => schedule.scheduleJob(
  "*/15 * * * * *",
  async function () {
    await prisma.$executeRaw("call updatescore();");
  }
);
