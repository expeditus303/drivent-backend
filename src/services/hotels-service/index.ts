import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import redis from "@/database/redis";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw cannotListHotelsError("Ticket not paid");
  }
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError("Ticket does not includes hotel");
  }
}

async function getHotels(userId: number) {
  await listHotels(userId);
  const cacheKey = "hotels";
  const cachedHotels = await redis.get(cacheKey);
  if(cachedHotels) {
    return JSON.parse(cachedHotels);
  } else {
    const hotels = await hotelRepository.findHotels();
    await redis.set(cacheKey, JSON.stringify(hotels));
    return hotels;
  }
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);
  const cacheKey = `hotel:${hotelId}`;
  const cachedHotels = await redis.get(cacheKey);
  if(cachedHotels) {
    console.log("cachedHotels", JSON.stringify(cachedHotels));
    return JSON.parse(cachedHotels);
  } else {
    const hotel = await hotelRepository.findRoomsByHotelId(hotelId);
    if (!hotel) {
      throw notFoundError();
    }
    await redis.set(cacheKey, JSON.stringify(hotel));
  }
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
