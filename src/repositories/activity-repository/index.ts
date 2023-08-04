import { prisma } from '@/config';
import { Activity, DateActivity, Location, Subscription } from '@prisma/client';

async function getDays(): Promise<DateActivity[]> {
  return prisma.dateActivity.findMany();
}

async function getLocations(): Promise<Location[]> {
  return prisma.location.findMany();
}

async function getActivities(
  date: Date,
  enrollmentId: number,
): Promise<Array<Partial<Activity & { isSubscribed: boolean }>>> {
  const activities = await prisma.activity.findMany({
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
      Subscription: {
        select: {
          enrollmentId: true,
        },
        where: {
          enrollmentId,
        },
      },
    },
  });

  const activitiesWithSubscription = activities.map((activity) => ({
    ...activity,
    isSubscribed: activity.Subscription.length > 0,
  }));

  return activitiesWithSubscription;
}

async function createSubscription(activityId: number, enrollmentId: number): Promise<[Subscription, Activity]> {
  const subscription = await prisma.$transaction([
    prisma.subscription.create({
      data: {
        activityId,
        enrollmentId,
      },
    }),
    prisma.activity.update({
      where: { id: activityId },
      data: {
        vacancies: {
          decrement: 1,
        },
      },
    }),
  ]);
  return subscription;
}

const activityRepository = {
  getActivities,
  getDays,
  getLocations,
  createSubscription,
};

export default activityRepository;
