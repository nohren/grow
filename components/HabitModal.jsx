import { useEffect, useRef, useState } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import { updateHabit, deleteHabit } from '../utils/ajax';
import { deepCopy } from '../utils/deepCopy';

const HabitModal = ({ show, onHide, readrender, modalhabit }) => {
  //this modal pops up when we click on an existing habit. It exists for users to update information.

  //beware props are empty on mount, and get hydrated after component mount, thats why you don't initialize

  //deep copy of passed in props so we can manipulate without altering state.
  const [habit, setHabit] = useState({
    id: '',
    habit: '',
    treemoji: '',
    path: '',
    dailyComplete: false,
    scale: 0.2,
    rate: 0.001,
    frequency: {},
    reps: 0,
    startDate: new Date(),
    description: '',
    dateLastCompleted: new Date(),
  });
  // const saveFlag = useRef(false);

  //why is the habit in app state changing?
  // bc {...obj} creates a shallow copy.  Anything more than 1 level deep retains its references to objects elsewhere

  useEffect(() => {
    if (show) {
      let copy = deepCopy(modalhabit);
      setHabit(copy);
    }
  }, [show]);

  const handleClick = (e) => {
    let key = e.target.title;
    let className = e.target.className;
    addRemoveFrequency(key, className);
  };

  //must create a deepcopy first, its never good to mutate state directly, must keep state pure.
  const addRemoveFrequency = (key, className) => {
    let copy = deepCopy(habit);
    if (className === 'frequencyBoxHighlighted col') {
      delete copy.frequency[key];
    } else if (className === 'frequencyBox col') {
      copy.frequency[key] = true;
    }
    setHabit(copy);
  };

  const handleChange = (e) => {
    //shalow clones it and that is ok for this use.
    setHabit({ ...habit, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateHabit(habit);
    readrender();
    onHide();
  };

  const handleDelete = async () => {
    onHide();
    await deleteHabit(habit.id);
    console.log('success');
    readrender();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
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
          <Row className={{ height: '100%', width: '100%' }}>
            <Col
              title="0"
              onClick={handleClick}
              className={
                habit.frequency[0] ? 'frequencyBoxHighlighted' : 'frequencyBox'
              }
            >
              Su
            </Col>
            <Col
              title="1"
              onClick={handleClick}
              className={
                habit.frequency[1] ? 'frequencyBoxHighlighted' : 'frequencyBox'
              }
            >
              M
            </Col>
            <Col
              title="2"
              onClick={handleClick}
              className={
                habit.frequency[2] ? 'frequencyBoxHighlighted' : 'frequencyBox'
              }
            >
              T
            </Col>
            <Col
              title="3"
              onClick={handleClick}
              className={
                habit.frequency[3] ? 'frequencyBoxHighlighted' : 'frequencyBox'
              }
            >
              W
            </Col>
            <Col
              title="4"
              onClick={handleClick}
              className={
                habit.frequency[4] ? 'frequencyBoxHighlighted' : 'frequencyBox'
              }
            >
              Th
            </Col>
            <Col
              title="5"
              onClick={handleClick}
              className={
                habit.frequency[5] ? 'frequencyBoxHighlighted' : 'frequencyBox'
              }
            >
              F
            </Col>
            <Col
              title="6"
              onClick={handleClick}
              className={
                habit.frequency[6] ? 'frequencyBoxHighlighted' : 'frequencyBox'
              }
            >
              S
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <div style={{ padding: '3%' }}>
        <textarea
          style={{ width: '100%' }}
          placeholder="description..."
          rows="10"
          cols="33"
          value={habit.description}
          onChange={handleChange}
          name={'description'}
        ></textarea>
        <div>Repetitions: {habit.reps}</div>
        <div>
          Start Date: {habit.startDate.toDateString()} at{' '}
          {habit.startDate.toTimeString()}
        </div>
        <div>
          Last Compeleted: {habit.dateLastCompleted.toDateString()} at
          {habit.dateLastCompleted.toTimeString()}
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
