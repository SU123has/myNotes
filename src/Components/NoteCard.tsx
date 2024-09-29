import { Badge, Card, Stack } from "react-bootstrap";
import { SimplifiedNote } from "./Notelists";
import { Link } from "react-router-dom";
import styles from "./NoteCard.module.css";

const NoteCard = ({ id, title, tags }: SimplifiedNote) => {
  return (
    <Card
      as={Link}
      //URL contains the NoteID, which we can grab from the NoteLayout Component
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5 fw-bold">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge
                  pill
                  bg="success"
                  key={tag.id}
                  className="text-truncates"
                >
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
