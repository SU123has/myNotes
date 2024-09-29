import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { Link, useOutletContext } from "react-router-dom";
import { Note } from "../App";
import ReactMarkdown from "react-markdown";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useState } from "react";

type ShowNoteProps = {
  onDelete: (id: string) => void;
};

const ShowNote = ({ onDelete }: ShowNoteProps) => {
  const note = useOutletContext<Note>();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge bg="primary" key={tag.id} className="text-truncates">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={3} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
            <Button
              variant="outline-danger"
              onClick={() => {
                setDeleteModalIsOpen(true);
              }}
            >
              Delete
            </Button>
            <Link to="..">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown className="border rounded p-3">
        {note.markdown}
      </ReactMarkdown>
      <ConfirmDeleteModal
        onDelete={onDelete}
        noteId={note.id}
        showModal={deleteModalIsOpen}
        handleClose={() => {
          setDeleteModalIsOpen(false);
        }}
      />
    </>
  );
};

export default ShowNote;
