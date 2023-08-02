import { prisma } from '@/config';
import { Activity, DateActivity, Location } from '@prisma/client';

async function getDays(): Promise<DateActivity[]> {
  return prisma.dateActivity.findMany();
}

async function getLocations(): Promise<Location[]> {
  return prisma.location.findMany();
}

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

const activityRepository = {
  getActivities,
  getDays,
  getLocations,
};

export default activityRepository;
