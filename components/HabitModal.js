import { useEffect, useRef, useState } from 'react';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap'
import ajax from './ajax'


export default function HabitModal(props) {

    //this modal pops up when we click on an existing habit. It exists for users to update information.
    // while the user has this open, changes will be made to the data flowing in from props.  
    // need state

    //beware props are empty on mount, and get hydrated after component mount, thats why you don't initialize
    //also why useEffect is key here.  This is for after mount refreshing state whenever a prop changes.
    const [habit, setHabit] = useState({ id: '', habit: '', treemoji: '', path: '', dailyComplete: false, scale: 0.2, rate: 0.001, frequency: {}, reps: 0, startDate: new Date(), description: '' });
    const saveFlag = useRef(false);
    
    //why is the habit in app state changing?  I just want it to change here in this local state.  It's changing the app level state
    // bc {...obj} creates a shallow copy.  Anything more than 1 level deep retains its references to objects elsewhere

    //this component is always active, even if its html is hidden using css or something

    //useeffect is side effect that runs after a first render.  Associate useEffect with the aftermath of a render process.
    useEffect(() => {
      //something here sets state for this pointing towards the prop object passed in
      //bc {...obj} creates a shallow copy.
      //purpose of void effect to change state to higher level app state
      //only trigger this void effect when we open and close the modal 
      if (props.show) {
        let deepCopy = JSON.parse(JSON.stringify(props.modalhabit));
        deepCopy.startDate = new Date(deepCopy.startDate);
        setHabit(deepCopy);
      }
    }, [props.show])

    const handleClick = (e) => {
      let key = e.target.title;
      let className = e.target.className;
      addRemoveFrequency(key, className);
    }

    const addRemoveFrequency = (key, className) => {
        //deep clones it so we can show the react shallow compare in setstate that we have a different frequency object and we should render
        let deepCopy = JSON.parse(JSON.stringify(habit));
        deepCopy.startDate = new Date(deepCopy.startDate);
        if (className === 'frequencyBoxHighlighted col') {
          delete deepCopy.frequency[key];
        } else if (className === 'frequencyBox col') { 
            deepCopy.frequency[key] = true;
        }
        setHabit(deepCopy);
    };
    
    const handleChange = (e) => {
      //shalow clones it and that is ok for this use.
      setHabit({...habit, [e.target.name]: e.target.value});
    };

    const handleSave = () => {
        //update habit (findandupdate), then read from app
        ajax.updateHabit(habit, (err, result) => {
            if (err) {
                console.log(err);
            } else {
              props.readrender();
              saveFlag.current = true;
            }
        });
    }
    useEffect(() => {
      if (saveFlag.current) {
          props.onHide();
          saveFlag.current = false;
      }
      //javascript is unable to determine obj equality?
    }, [props.modalhabit])
  
    //react bootstrap component cannot accept unknown props, so we pull it out of the stream before sending the rest to the Modal
    //component
    const {addremove, changehabit, ...others} = props;


    return (
        <Modal {...others} aria-labelledby="contained-modal-title-vcenter" dialogClassName="">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <input 
                      name={'habit'}
                      value={habit.habit}
                      onChange={handleChange}
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container style={{ height: '100%', width: '100%' }}>
                    <Row className={{ height: '100%', width: '100%' }}>
                        <Col title="0" onClick={handleClick} className={habit.frequency[0] ? "frequencyBoxHighlighted" : "frequencyBox"}>S</Col>
                        <Col title="1" onClick={handleClick} className={habit.frequency[1] ? "frequencyBoxHighlighted" : "frequencyBox"}>M</Col>
                        <Col title="2" onClick={handleClick} className={habit.frequency[2] ? "frequencyBoxHighlighted" : "frequencyBox"}>T</Col>
                        <Col title="3" onClick={handleClick} className={habit.frequency[3] ? "frequencyBoxHighlighted" : "frequencyBox"}>W</Col>
                        <Col title="4" onClick={handleClick} className={habit.frequency[4] ? "frequencyBoxHighlighted" : "frequencyBox"}>Th</Col>
                        <Col title="5" onClick={handleClick} className={habit.frequency[5] ? "frequencyBoxHighlighted" : "frequencyBox"}>F</Col>
                        <Col title="6" onClick={handleClick} className={habit.frequency[6] ? "frequencyBoxHighlighted" : "frequencyBox"}>Su</Col>
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
                >
                </textarea>
                <div>
                    <span>Repetitions:{' '}{habit.reps}</span>
                </div>
                <div>
                    <span>Start Date:{' '}{habit.startDate.toDateString()}</span>
                </div>
            </div>

            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>

    );
}
