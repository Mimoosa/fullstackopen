import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import { useAnecdoteActions } from "./store";
import { useEffect } from "react";
import Notification from "./components/Notification";

const App = () => {
  const { initialize } = useAnecdoteActions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div>
      <Filter />
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
