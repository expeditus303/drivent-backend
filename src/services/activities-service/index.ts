import activityRepository from '../../repositories/activity-repository';
import { notFoundError } from '../../errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { cannotListActivitiesError } from '@/errors/cannot-list-activities-error';

async function listActivities(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED') {
    throw cannotListActivitiesError('Ticket not paid');
  }
  if (ticket.TicketType.isRemote) {
    throw cannotListActivitiesError('Ticket does not includes hotel');
  }
}

async function getDays(userId: number) {
  await listActivities(userId);

  const days = await activityRepository.getDays();
  if (!days) {
    throw notFoundError();
  }
  return days;
}

async function getLocations(userId: number) {
  await listActivities(userId);

  const locations = await activityRepository.getLocations();
  if (!locations) {
    throw notFoundError();
  }
  return locations;
}

async function getActivities(userId: number) {
  await listActivities(userId);

  const activities = await activityRepository.getActivities();
  if (!activities) {
    throw notFoundError();
  }
  return activities;
}

const activityService = {
  getDays,
  getLocations,
  getActivities,
};

export default activityService;
