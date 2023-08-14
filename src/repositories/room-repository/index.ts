import { prisma } from "@/database";

async function findAllByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    }
  });
}

async function findById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Hotel: true,
    }
  });
}

const roomRepository = {
  findAllByHotelId,
  findById
};

export default roomRepository;
