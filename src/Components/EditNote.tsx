import { useOutletContext } from "react-router-dom";
import { Note, NoteData, Tag } from "../App";
import NoteForm from "./NoteForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

const EditNote = ({ onSubmit, onAddTag, availableTags }: EditNoteProps) => {
  const note = useOutletContext<Note>();
  return (
    <>
      <h1 className="mb-4">
        Edit Note <FontAwesomeIcon icon={faPenToSquare} />
      </h1>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(data) => onSubmit(note.id, data)} //here we create an arrow inline function to create another onSubmit function with note.id and data as arguments, data is the data passed by onSubmit function in NewForm.tsx
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
};

export default EditNote;
