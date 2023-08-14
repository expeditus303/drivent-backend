import { prisma } from "@/database";

async function findFirst() {
  return prisma.event.findFirst();
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
