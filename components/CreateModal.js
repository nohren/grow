import ajax from './ajax'
import { useState } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap'






export default function CreateModal({ show, handleClose, addHabit }) {
    //ultimate purpose - create and send a habit to the db, then read the habit from the db to parent state.
    //1. Treemoji, path, scale and rate are subjective to the individual .gltf file, queue class for gltf's in O(1) time

    //state for a habit
    const [habit, setHabit] = useState({ habit: '', dailyComplete: false, frequency: {}, reps: 0, startDate: new Date(), description: '', dateLastCompleted: new Date() });
    const [defaultHabit, setDefaultHabit] = useState({ habit: '', dailyComplete: false, frequency: {}, reps: 0, startDate: new Date(), description: '', dateLastCompleted: new Date() })
    
    
    //function for appending the habit into parent habits state
    const addRemoveFrequency = (key, className) => {
        let copyHabit = { ...habit };
        if (className === 'frequencyBoxHighlighted col') {
            delete copyHabit.frequency[key];
        } else if (className === 'frequencyBox col') {
            copyHabit.frequency[key] = true;
        }
        setHabit(copyHabit);
    };

    const handleFrequencyClick = (e) => {
        let key = e.target.title;
        let className = e.target.className;
        addRemoveFrequency(key, className)
    };

    //make a copy of the habit object, set a variable property determined by name equal to the value 
    const onChangeHabit = (e) => {
        setHabit({ ...habit, [e.target.name]: e.target.value });
    };
    //treemoji, path, scale, rate
    const handleSave = () => {
      ajax.createHabit(habit, (res) => {
        ajax.getHabits((h) => {
            addHabit(h.data);
        })
    });
      setHabit(defaultHabit);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
              
                    <Modal.Title>
                        <input name="habit" value={habit.habit} onChange={onChangeHabit} placeholder="Habit name" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container style={{ height: '100%', width: '100%' }}>
                        <Row className={{ height: '100%', width: '100%' }}>
                            <Col title="0" onClick={handleFrequencyClick} className={habit.frequency[0] ? "frequencyBoxHighlighted" : "frequencyBox"}>S</Col>
                            <Col title="1" onClick={handleFrequencyClick} className={habit.frequency[1] ? "frequencyBoxHighlighted" : "frequencyBox"}>M</Col>
                            <Col title="2" onClick={handleFrequencyClick} className={habit.frequency[2] ? "frequencyBoxHighlighted" : "frequencyBox"}>T</Col>
                            <Col title="3" onClick={handleFrequencyClick} className={habit.frequency[3] ? "frequencyBoxHighlighted" : "frequencyBox"}>W</Col>
                            <Col title="4" onClick={handleFrequencyClick} className={habit.frequency[4] ? "frequencyBoxHighlighted" : "frequencyBox"}>Th</Col>
                            <Col title="5" onClick={handleFrequencyClick} className={habit.frequency[5] ? "frequencyBoxHighlighted" : "frequencyBox"}>F</Col>
                            <Col title="6" onClick={handleFrequencyClick} className={habit.frequency[6] ? "frequencyBoxHighlighted" : "frequencyBox"}>S</Col>
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
                            name="description"
                            onChange={onChangeHabit}
                        >
                        </textarea>
                        </div>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => {handleClose(); handleSave();}}>
                               Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
                );
}