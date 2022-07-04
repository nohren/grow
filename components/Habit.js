import { useState } from 'react';
/**
 * A hook that returns a default habit object
 * Declares and defines an instance in memory for a habit
 */
export const Habit = () => {
  const [habit, setHabit] = useState({
    id: '',
    habit: '',
    treemoji: '',
    path: '',
    dailyComplete: false,
    scale: 0,
    rate: 0,
    frequency: {},
    reps: 0,
    startDate: new Date(),
    description: '',
    dateLastCompleted: new Date(),
  });
  return [habit, setHabit];
};
