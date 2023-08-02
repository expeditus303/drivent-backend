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

async function getActivities() {
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
