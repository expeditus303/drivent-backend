import activityRepository from '../../repositories/activity-repository';
import { notFoundError } from '../../errors';

async function getDays() {
  const days = await activityRepository.getDays();
  if (!days) {
    throw notFoundError();
  }
  return days;
}

async function getLocations() {
  const locations = await activityRepository.getLocations();
  if (!locations) {
    throw notFoundError();
  }
  return locations;
}

const activityService = {
  getDays,
  getLocations,
};

export default activityService;
