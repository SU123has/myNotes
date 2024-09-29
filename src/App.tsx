import { Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NewNote from "./Components/NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import Notelists from "./Components/Notelists";
import NoteLayout from "./Components/NoteLayout";
import ShowNote from "./Components/Note";
import EditNote from "./Components/EditNote";
import toast, { Toaster } from "react-hot-toast";

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

//If I change the value of a Tag, we would have to go to every Note and change its value
//instead we can store IDs of tags and when we change value of tag its gets reflected everywhere
export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[]; //store IDs for each one of the tags
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []); //stores data in Raw format
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  //notes store notes along with tags (enriched format)
  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);
  //runs only when notes or tags state have changed

  function onCreateNote({ tags, ...data }: NoteData) {
    //need to convert NoteData into RawNote
    setNotes((prevNotes) => [
      ...prevNotes,
      { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
    ]);
    toast.success("New Note Successfully");
  }

  //for the purpose of synchronising with localStorage
  function addTag(tag: Tag) {
    setTags((prevTags) => [...prevTags, tag]);
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    //similar to onCreateNote function
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
          };
        } else {
          return note;
        }
      });
    });
    toast.success("Note updated successfully");
  }

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
    toast.error("Note deleted");
  }

  function onUpdateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function onDeleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <Notelists
              availableTags={tags}
              notes={notesWithTags}
              updateTag={onUpdateTag}
              deleteTag={onDeleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<ShowNote onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
