import { scheduleJob } from 'node-schedule';
import prisma from './prisma';

const CRON = '*/30 * * * *';

export function scheduleUpdateScoresProcedure() {
  return scheduleJob(CRON, async () => {
    try {
      console.time('running updatescore');
      await prisma.$executeRaw`call updatescore();`;
      console.timeEnd(`running updatescore`);
    } catch (e) {
      console.log(e);
    }
  });
}
