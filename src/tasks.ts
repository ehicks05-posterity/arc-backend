import { scheduleJob } from 'node-schedule';
import prisma from './prisma';

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
