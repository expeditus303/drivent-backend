import { ApplicationError } from '@/protocols';

export function cannotListActivitiesError(message: string): ApplicationError {
  return {
    name: 'cannotListActivitiesError',
    message: `Cannot list activities! ${message}`,
  };
}
