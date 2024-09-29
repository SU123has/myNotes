import { Button, Col, Modal, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type ConfirmDeleteModalProps = {
  onDelete: (id: string) => void;
  noteId: string;
  showModal: boolean;
  handleClose: () => void;
};

const ConfirmDeleteModal = ({
  onDelete,
  noteId,
  showModal,
  handleClose,
}: ConfirmDeleteModalProps) => {
  const navigate = useNavigate();
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col className="text-center">
            Are you sure you want to delete this Note ?
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <Stack gap={2} direction="horizontal">
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(noteId);
                  navigate("/");
                }}
              >
                Yes
              </Button>
              <Button variant="outline-primary" onClick={handleClose}>
                Cancel
              </Button>
            </Stack>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteModal;
