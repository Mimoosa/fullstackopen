import { useAnecdotes, useAnecdoteActions } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, sort } = useAnecdoteActions();

  const handleVote = (id) => {
    vote(id);
    sort();
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
