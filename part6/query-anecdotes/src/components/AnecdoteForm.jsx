import { useAnecdotes } from "../hooks/useAnecdotes";
import useNotify from "../hooks/useNotify";

const AnecdoteForm = () => {
  const { addAnecdote: addAnecdoteToServer } = useAnecdotes();

  const { setMessage } = useNotify();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.reset();

    addAnecdoteToServer(content, {
      onSuccess: () => {
        setMessage(`new anecdote '${content}' added`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      },
      onError: (error) => {
        console.log(error);
        setMessage(error?.message || `failed to add new annecdote ${content}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      },
    });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
