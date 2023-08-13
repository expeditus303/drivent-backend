import redis from "@/database/redis";
import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { Event } from "@prisma/client";
import dayjs from "dayjs";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = "firstEvent";
  const cachedEvent = await redis.get(cacheKey);
  if(cachedEvent) {
    return JSON.parse(cachedEvent); 
  } else {
    const event = await eventRepository.findFirst();
    if (!event) throw notFoundError();
    await redis.set(cacheKey, JSON.stringify(event));
    return event;
  }
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
