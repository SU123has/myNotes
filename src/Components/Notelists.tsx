import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "../App";
import { useMemo, useState } from "react";
import NoteCard from "./NoteCard";
import EditTagsModal from "./EditTagsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

export type SimplifiedNote = {
  //to show Note details on NoteCard
  id: string;
  title: string;
  tags: Tag[];
};

type NotelistProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  updateTag: (id: string, label: string) => void;
  deleteTag: (id: string) => void;
};

const Notelists = ({
  availableTags,
  notes,
  updateTag,
  deleteTag,
}: NotelistProps) => {
  const [title, setTitle] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

  //filter the notes as we type title or tags
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      //if no title entered and no tags selected, then no filtering, filteredNotes has all notesWithTags data
      return (
        //if title not entered, next statement would short-circuit
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        //if no tags selected, next statement would short-circuit
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>
            My Notes <FontAwesomeIcon icon={faClipboard} />
          </h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4 mt-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={selectedTags.map((tag) => {
                  return {
                    //doing this because this is what CreateReactSelect expects for values
                    //it expects an array of objects having label and value properties
                    //therefore we need to map from Tag type objects to format expected by CreateReactSelect
                    label: tag.label,
                    value: tag.id,
                  };
                })}
                options={availableTags.map((tag) => {
                  return {
                    label: tag.label,
                    value: tag.id,
                  };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return {
                        //we need to map CreateReactSelect format to format expected by Tag type
                        label: tag.label,
                        id: tag.value,
                      };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} md={3} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        availableTags={availableTags}
        showModal={editTagsModalIsOpen}
        handleClose={() => {
          setEditTagsModalIsOpen(false);
        }}
        deleteTag={deleteTag}
        updateTag={updateTag}
      />
    </>
  );
};

export default Notelists;
