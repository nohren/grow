import { React, useEffect } from 'react';
import { Habit } from './Habit';
import { Modal, Container, Button } from 'react-bootstrap';
import { updateHabit, deleteHabit } from '../utils/network';
import { deepCopy } from '../utils/deepCopy';
import { isNil } from '../utils/utils';
import ToggleDays from './ToggleDays';

/**
 *
 * @prop {boolean} open
 * @prop {(event) => void} close
 * @prop {(newData) => void} writeData
 * @prop {Data} data
 * @returns
 */
const HabitModal = (props) => {
  const { open, close, updateView, data } = props;
  const [habit, setHabit] = Habit();

  useEffect(() => {
    if (open) {
      let copy = deepCopy(data);
      setHabit(copy);
    }
  }, [open]);

  if (isNil(data)) {
    return null;
  }

  /**
   * Need to convert number[] to
   * Record<string,boolean>
   * @param {number[]} value
   */
  const setDays = (value) => {
    const frequency = {};
    value.map((day) => {
      frequency[`${day}`] = true;
    });
    setHabit({ ...habit, frequency });
  };

  /**
   * @param {Record<string, boolean>} frequency
   */
  const daysTransformer = (frequency) => {
    return Object.keys(frequency).map((frequency) => parseInt(frequency));
  };

  const handleChange = (e) => {
    setHabit({ ...habit, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateHabit(habit);
    updateView();
    close();
  };

  const handleDelete = async () => {
    close();
    await deleteHabit(habit.id);
    updateView();
  };

  return (
    <Modal
      show={open}
      onHide={close}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName=""
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <input name={'habit'} value={habit.habit} onChange={handleChange} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container style={{ height: '100%', width: '100%' }}>
          <ToggleDays
            setDays={setDays}
            value={daysTransformer(habit.frequency)}
          />
        </Container>
      </Modal.Body>
      <div style={{ padding: '3%' }}>
        <textarea
          style={{ width: '100%', borderRadius: '6px' }}
          placeholder="description..."
          rows="10"
          cols="33"
          value={habit.description}
          onChange={handleChange}
          name={'description'}
        ></textarea>
        <div>Repetitions: {habit.reps}</div>
        <div>
          Start Date: {habit.startDate?.toDateString()} at{' '}
          {habit.startDate?.toTimeString()}
        </div>
        <div>
          Last Compeleted: {habit.dateLastCompleted?.toDateString()} at
          {habit.dateLastCompleted?.toTimeString()}
        </div>
      </div>

      <Modal.Footer className={'override-modal-footer'}>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default HabitModal;
