import activityRepository from '../../repositories/activity-repository';
import { notFoundError, conflictError } from '../../errors';
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

async function getActivities(userId: number, date: Date) {
  await listActivities(userId);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const activities = await activityRepository.getActivities(date, enrollment.id);
  if (!activities) {
    throw notFoundError();
  }
  return activities;
}

async function postSubscription(userId: number, activityId: number) {
  await listActivities(userId);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const subscription = await activityRepository.createSubscription(activityId, enrollment.id);
  if (!subscription) {
    throw conflictError('Ocorreu um erro ao tentar realizar a inscrição na atividade!');
  }
  return subscription;
}

async function deleteSubscription(userId: number, activityId: number) {
  await listActivities(userId);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const subscriptionId = await activityRepository.findSubscription(activityId, enrollment.id);

  const subscription = await activityRepository.deleteSubscription(activityId, subscriptionId[0].id);
  if (!subscription) {
    throw conflictError('Ocorreu um erro ao tentar excluir a inscrição na atividade!');
  }
  return subscription;
}

const activityService = {
  getDays,
  getLocations,
  getActivities,
  postSubscription,
  deleteSubscription,
};

export default activityService;
