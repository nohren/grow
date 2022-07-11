import { useState } from 'react';
/**
 * A hook that returns a default habit object
 * Declares and defines an instance in memory for a habit
 * This is for use when creating a habit.  We need to display something in the modal.
 */
export const useHabit = () => {
  return useState({
    id: '',
    name: '',
    treemoji: '',
    path: '',
    scale: null,
    frequency: [],
    reps: 0,
    description: '',
    initialScale: 0,
    startDate: null,
    lastCompletedDate: null,
    lastDecayedDate: null,
  });
};
