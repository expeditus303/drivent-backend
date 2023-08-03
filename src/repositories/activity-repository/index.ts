import { prisma } from '@/config';
import { Activity, DateActivity, Location } from '@prisma/client';

async function getDays(): Promise<DateActivity[]> {
  return prisma.dateActivity.findMany();
}

async function getLocations(): Promise<Location[]> {
  return prisma.location.findMany();
}

async function getActivities(date: Date): Promise<Partial<Activity>[]> {
  return prisma.activity.findMany({
    where: {
      ScheduleEvent: {
        some: {
          DateActivity: {
            activityDate: date,
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      vacancies: true,
      startTime: true,
      endTime: true,
      Location: {
        select: {
          name: true,
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
