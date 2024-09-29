import { Navigate, Outlet, useParams } from "react-router-dom";
import { Note } from "../App";

type NoteLayoutProps = {
  notes: Note[];
};

const NoteLayout = ({ notes }: NoteLayoutProps) => {
  const { id } = useParams();
  const note = notes.find((note) => note.id === id);
  if (!note) {
    //note not found
    return <Navigate to="/" replace />;
    //When the replace prop is used in <Navigate>, it replaces the current entry in the history stack instead of adding a new one
  }
  //pass the retrieved note as context to the nested child routes
  //outlet acts as placeholder where child routes are rendered
  return <Outlet context={note} />;
};

export default NoteLayout;
