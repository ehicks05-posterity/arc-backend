import { scheduleJob } from 'node-schedule';
import prisma from './prisma';

export function scheduleUpdateScoresProcedure() {
  return scheduleJob('*/15 * * * * *', async () => {
    try {
      await prisma.$executeRaw`call updatescore();`;
    } catch (e) {
      console.log(e);
    }
  });
}
