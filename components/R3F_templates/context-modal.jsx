import { Modal, Button } from 'react-bootstrap';
import { deleteHabit } from '../../helpers/ajax';

export default function ContextModal({
  show,
  handleClose,
  modalhabit,
  readrender,
}) {
  const handleDelete = () => {
    handleClose();
    deleteHabit(modalhabit.id, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('success');
        readrender();
      }
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{modalhabit.habit}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          As long as its aligned with you, its aligned with me.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
