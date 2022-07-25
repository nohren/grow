import { useState } from 'react';
import habitConfig from '../../utils/habitConfig';
/**
 * A hook that returns a default habit object
 * Declares and defines an instance in memory for a habit
 * This is for use when creating a habit.  We need to display something in the modal.
 */
const { repsGoal } = habitConfig;
export const useHabit = () => {
  return useState({
    id: '',
    name: '',
    treemoji: '',
    path: '',
    frequency: [],
    reps: 0,
    repsAdjusted: 0,
    description: '',
    repsGoal: repsGoal,
    startDate: null,
    lastCompleted: null,
    lastDecayed: null,
  });
};
