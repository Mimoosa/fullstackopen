import { useState, useEffect } from "react";
import anecdoteService from "../services/anecdotes";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    input: {
      type,
      value,
      onChange,
    },
    reset,
  };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data));
  }, []);

  const addAnecdote = async (newAnecdote) => {
    const response = await anecdoteService.createNew(newAnecdote);
    setAnecdotes((prev) => prev.concat(response));
  };

  const deleteAnecdote = async (id) => {
    const response = await anecdoteService.remove(id);
    if (response) {
      setAnecdotes(anecdotes.filter((anecdote) => anecdote.id != id));
    }
  };

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  };
};
