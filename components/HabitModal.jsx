import { React, useEffect } from 'react';
import { useHabit } from './hooks/useHabit';
import { Modal, Container, Button } from 'react-bootstrap';
import { updateHabit, deleteHabit, createHabit } from '../utils/network';
import { isNil } from '../utils/utils';
import {
  getCurrentTimeStamp,
  stringToDateFormatter,
} from '../utils/dateFunctions';
import ToggleDays from './ToggleDays';

/**
 * @prop {boolean} open
 * @prop {(event) => void} close
 * @prop {(newData) => void} writeData
 * @prop {Data} data
 * @prop {string} Action - "edit" or "create"
 * @returns {JSX.Element}
 */
const HabitModal = (props) => {
  const { open, close, updateView, data, create = false } = props;
  //the useState portion is only run one time right?
  const [habit, setHabit] = useHabit();
  const {
    id,
    name = '',
    treemoji,
    frequency,
    reps,
    description,
    startDate,
    lastCompletedDate,
  } = habit ?? {};

  useEffect(() => {
    //triggers after first render and after subsequent renders where the currentValue of open is !== the previousValue.

    //it will set the state on edit to the habit data. Then remove our edits on close.
    if (!create) {
      setHabit(data);
    }
  }, [open]);

  if (isNil(habit)) {
    return null;
  }

  const setDays = (value) => {
    setHabit({ ...habit, frequency: value });
  };

  const handleChange = (e) => {
    setHabit({ ...habit, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await updateHabit(habit);
    updateView();
    close();
  };

  const handleCreate = async () => {
    await createHabit({
      ...habit,
      startDate: getCurrentTimeStamp(),
      lastDecayedDate: getCurrentTimeStamp(),
    });
    updateView();
    close();
  };

  const handleDelete = async () => {
    close();
    await deleteHabit(id);
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
          {treemoji}
          <input name={'name'} value={name} onChange={handleChange} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container className="weekContainer">
          <ToggleDays setDays={setDays} value={frequency} size="large" />
        </Container>
      </Modal.Body>
      <div style={{ padding: '0 3% 3% 3%' }}>
        <textarea
          className="modalText"
          placeholder="description..."
          rows="10"
          cols="33"
          value={description}
          onChange={handleChange}
          name={'description'}
        ></textarea>
        <div className="verticalLineSpacing">
          Start Date: {stringToDateFormatter(startDate)}
        </div>
        <div className="verticalLineSpacing">
          Last Complete: {stringToDateFormatter(lastCompletedDate)}
        </div>
        <div className="verticalLineSpacing">Repetitions: {reps}</div>
      </div>

      <Modal.Footer className={'override-modal-footer'}>
        {!create && (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button
          variant="primary"
          onClick={create === true ? handleCreate : handleUpdate}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default HabitModal;
