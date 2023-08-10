import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function createEvent() {
  let event = await prisma.event.findFirst();

  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl:
          'https://uploads-ssl.webflow.com/62235d098ddf9185c2d74422/63501c4f05bcfe3a3ce9327a_logo_pink%20(1).png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }
}

async function createTicketTypes() {
  let ticketTypes = await prisma.ticketType.findFirst();

  if (!ticketTypes) {
    await prisma.ticketType.create({
      data: { name: 'Online', price: 200, includesHotel: false, isRemote: true },
    });

    await prisma.ticketType.create({
      data: { name: 'Presencial', price: 600, includesHotel: true, isRemote: false },
    });

    await prisma.ticketType.create({
      data: { name: 'Presencial', price: 300, includesHotel: false, isRemote: false },
    });
  }
}

async function createRooms(capacities: number[], createdHotelId: number) {
  return await Promise.all(
    capacities.map(async (capacity) => {
      for (let i = 1; i <= 12; i++) {
        await prisma.room.create({
          data: {
            name: `${capacity * 100 + i}`,
            capacity: capacity,
            hotelId: createdHotelId,
          },
        });
      }
    }),
  );
}

async function createHotelsAndRooms() {
  const hotelsExample = [
    {
      name: 'Driven Resort',
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
    },
    {
      name: 'Driven Palace',
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/The_Most_Expensive.jpg',
    },
    {
      name: 'Driven World',
      image: 'https://www.ahstatic.com/photos/c096_ho_00_p_1024x768.jpg',
    },
  ];

  const hotels = await prisma.hotel.findMany();

  if (hotels.length === 0) {
    await Promise.all(
      hotelsExample.map(async (hotel) => {
        const createdHotel = await prisma.hotel.create({
          data: {
            name: hotel.name,
            image: hotel.image,
          },
        });

        const capacities = hotel.name === 'Driven World' ? [1, 2] : [1, 2, 3];
        await createRooms(capacities, createdHotel.id);
      }),
    );
  }
}

async function createLocationsAndDates() {
  const existingLocations = await prisma.location.findMany();

  if (existingLocations.length === 0) {
    const locationsToCreate = [
      {
        name: 'Auditório Principal',
      },
      {
        name: 'Auditório Lateral',
      },
      {
        name: 'Sala de Workshop',
      },
    ];

    await prisma.location.createMany({
      data: locationsToCreate,
    });
  }

  const existingDates = await prisma.dateActivity.findMany();
  if (existingDates.length === 0) {
    const datesToCreate = [
      {
        activityDate: new Date('08/04/2023'),
      },
      {
        activityDate: new Date('08/05/2023'),
      },
      {
        activityDate: new Date('08/06/2023'),
      },
    ];

    await prisma.dateActivity.createMany({
      data: datesToCreate,
    });
  }
}

async function createActivities() {
  const activities = await prisma.activity.findMany();

  if (activities.length === 0) {
    const locations = await prisma.location.findMany();
    const event = await prisma.event.findFirst();

    if (locations?.length > 0 && event) {
      const activities = [
        {
          title: 'Minecraft: Montando o PC ideal',
          vacancies: 27,
          startTime: new Date('2023-08-04T09:00:00Z'),
          endTime: new Date('2023-08-04T10:00:00Z'),
          eventId: event?.id,
          locationId: locations[0]?.id,
        },
        {
          title: 'LoL: Montando o PC ideal',
          vacancies: 0,
          startTime: new Date('2023-08-04T10:00:00Z'),
          endTime: new Date('2023-08-04T11:00:00Z'),
          eventId: event?.id,
          locationId: locations[0]?.id,
        },
        {
          title: 'Pensando do jeito React',
          vacancies: 15,
          startTime: new Date('2023-08-04T11:00:00Z'),
          endTime: new Date('2023-08-04T12:00:00Z'),
          eventId: event?.id,
          locationId: locations[0]?.id,
        },
        {
          title: 'Palestra X',
          vacancies: 30,
          startTime: new Date('2023-08-04T09:00:00Z'),
          endTime: new Date('2023-08-04T11:00:00Z'),
          eventId: event?.id,
          locationId: locations[1]?.id,
        },
        {
          title: 'Palestra Y',
          vacancies: 15,
          startTime: new Date('2023-08-04T09:00:00Z'),
          endTime: new Date('2023-08-04T10:00:00Z'),
          eventId: event?.id,
          locationId: locations[2]?.id,
        },
        {
          title: 'Palestra Z',
          vacancies: 0,
          startTime: new Date('2023-08-04T10:00:00Z'),
          endTime: new Date('2023-08-04T11:00:00Z'),
          eventId: event?.id,
          locationId: locations[2]?.id,
        },
        {
          title: 'Workshop Prisma',
          vacancies: 22,
          startTime: new Date('2023-08-04T11:00:00Z'),
          endTime: new Date('2023-08-04T12:00:00Z'),
          eventId: event?.id,
          locationId: locations[2]?.id,
        },
        {
          title: 'Palestra Z',
          vacancies: 3,
          startTime: new Date('2023-08-05T09:00:00Z'),
          endTime: new Date('2023-08-05T10:00:00Z'),
          eventId: event?.id,
          locationId: locations[0]?.id,
        },
        {
          title: 'Workshop Typescript',
          vacancies: 10,
          startTime: new Date('2023-08-05T10:00:00Z'),
          endTime: new Date('2023-08-05T11:00:00Z'),
          eventId: event?.id,
          locationId: locations[0]?.id,
        },
        {
          title: 'Workshop AWS',
          vacancies: 22,
          startTime: new Date('2023-08-05T09:00:00Z'),
          endTime: new Date('2023-08-05T12:00:00Z'),
          eventId: event?.id,
          locationId: locations[1]?.id,
        },
        {
          title: 'Workshop Jest',
          vacancies: 12,
          startTime: new Date('2023-08-06T09:00:00Z'),
          endTime: new Date('2023-08-06T10:00:00Z'),
          eventId: event?.id,
          locationId: locations[2]?.id,
        },
      ];

      await prisma.activity.createMany({
        data: activities,
      });
    }
  }
}

async function createSchedule() {
  const schedules = await prisma.scheduleEvent.findMany();

  if (schedules.length === 0) {
    await createLocationsAndDates();
    await createActivities();

    const activities = await prisma.activity.findMany();
    const dates = await prisma.dateActivity.findMany();

    if (activities?.length > 0 && dates?.length > 0) {
      const schedules = [
        {
          activityId: activities[0]?.id,
          dateId: dates[0]?.id,
        },
        {
          activityId: activities[1]?.id,
          dateId: dates[0]?.id,
        },
        {
          activityId: activities[2]?.id,
          dateId: dates[0]?.id,
        },
        {
          activityId: activities[3]?.id,
          dateId: dates[0]?.id,
        },
        {
          activityId: activities[4]?.id,
          dateId: dates[0]?.id,
        },
        {
          activityId: activities[5]?.id,
          dateId: dates[0]?.id,
        },
        {
          activityId: activities[6]?.id,
          dateId: dates[0]?.id,
        },
        {
          activityId: activities[7]?.id,
          dateId: dates[1]?.id,
        },
        {
          activityId: activities[8]?.id,
          dateId: dates[1]?.id,
        },
        {
          activityId: activities[9]?.id,
          dateId: dates[1]?.id,
        },
        {
          activityId: activities[10]?.id,
          dateId: dates[2]?.id,
        },
      ];

      await prisma.scheduleEvent.createMany({
        data: schedules,
      });
    }
  }
}

async function main() {
  await Promise.all([createEvent(), createTicketTypes(), createHotelsAndRooms(), createSchedule()]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
