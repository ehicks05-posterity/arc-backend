const schedule = require("node-schedule");
const prisma = require('./prisma');

module.exports.scheduleUpdateScoresProcedure = () => schedule.scheduleJob(
  "*/15 * * * * *",
  async function () {
    try {
      await prisma.$executeRaw`call updatescore();`;
    } catch (e) {
      console.log(e);
    }
  }
);
