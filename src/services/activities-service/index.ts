import activityRepository from '../../repositories/activity-repository';
import { notFoundError } from '../../errors';

async function getDays() {
  const days = await activityRepository.getDays();
  if (!days) {
    throw notFoundError();
  }
  return days;
}

const activityService = {
  getDays,
};

export default activityService;
