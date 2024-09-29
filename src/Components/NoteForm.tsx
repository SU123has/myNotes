import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreateReactSelect from "react-select/creatable";
import { NoteData, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";

//NoteFormProps is a type of function passed as a props to NewForm.tsx component
type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;
//all props of NoteData type are optional

const NoteForm = ({
  onSubmit,
  onAddTag,
  availableTags,
  //giving default values to NoteData props, in case they are not passed(in case of creating new form), they take the default values, in case of editing, they take the corresponding values
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      //non-null assertion operator as title and markdown are required fields in the Form
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });
    navigate("..");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} defaultValue={title} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreateReactSelect
                onCreateOption={(label) => {
                  const newTag = {
                    id: uuidV4(),
                    label,
                  };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
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
        <Row>
          <Col>
            <Form.Group controlId="markdown">
              <Form.Label>Body</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={15}
                ref={markdownRef}
                defaultValue={markdown}
              />
            </Form.Group>
          </Col>
        </Row>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit">Save</Button>
          <Link to="..">
            {/* go back to previous page */}
            <Button type="button" variant="danger">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
};

export default NoteForm;
