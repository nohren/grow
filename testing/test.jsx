import { dayInMs, weekInMs } from '../utils/dateFunctions';
import { updateHabits } from '../utils/network';

/**
 * purpose is to test decay function
 * object to array of habits
 * change last decayed
 */
const RewindDecayDatesDay = async (habits, updateView) => {
  const container = Object.values(habits).map((habit) => {
    const copy = { ...habit };
    const yesterday = Date.now() - dayInMs;
    copy.lastDecayedDate = yesterday;
    return copy;
  });
  try {
    await updateHabits(container);
    updateView?.();
  } catch (e) {
    console.log(e);
  }
};

const RewindDecayDatesWeek = async (habits, updateView) => {
  const container = Object.values(habits).map((habit) => {
    const copy = { ...habit };
    const lastWeek = Date.now() - weekInMs;
    copy.lastDecayedDate = lastWeek;
    return copy;
  });
  try {
    await updateHabits(container);
    updateView?.();
  } catch (e) {
    console.log(e);
  }
};

export const TestButtons = (props) => {
  const { habits, updateView } = props;
  return (
    <div style={{ position: 'absolute', top: '3%', right: '3%', zIndex: 2 }}>
      <button onClick={() => RewindDecayDatesDay(habits, updateView)}>
        Simulate 1 day
      </button>
      <button onClick={() => RewindDecayDatesWeek(habits, updateView)}>
        Simulate 1 week
      </button>
    </div>
  );
};
