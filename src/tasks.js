import { scheduleJob } from 'node-schedule';
import prisma from './prisma';

// every 2 minutes
const CRON = '*/30 * * * *';

export function scheduleUpdateScoresProcedure() {
  return scheduleJob(CRON, async () => {
    try {
      await prisma.$executeRaw`call updatescore();`;
    } catch (e) {
      console.log(e);
    }
  });
}
