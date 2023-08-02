import { prisma } from '@/config';
import { Activity, DateActivity } from '@prisma/client';

async function getActivities(): Promise<Activity[]> {
  return prisma.activity.findMany({
    include: {
      Location: true,
      ScheduleEvent: {
        include: {
          DateActivity: true,
        },
      },
    },
  });
}

async function getDays(): Promise<DateActivity[]> {
  return prisma.dateActivity.findMany();
}

const activityRepository = {
  getActivities,
  getDays,
};

export default activityRepository;
