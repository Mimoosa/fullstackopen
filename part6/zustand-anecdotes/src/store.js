import { create } from "zustand";
import anecdoteService from "./services/anecdotes";
import { useShallow } from "zustand/react/shallow";

import useNotificationStore from "./notificationStore";

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    vote: async (id) => {
      const { showSuccessMessage, showErrorMessage } =
        useNotificationStore.getState().actions;
      const anecdote = get().anecdotes.find((a) => a.id === id);
      if (!anecdote) {
        showErrorMessage(`Anecdote not found`);
        return;
      }
      try {
        const updated = await anecdoteService.update(id, {
          ...anecdote,
          votes: anecdote.votes + 1,
        });
        set((state) => ({
          anecdotes: state.anecdotes.map((anecdote) =>
            anecdote.id === id ? updated : anecdote,
          ),
        }));
        get().actions.sort();
        showSuccessMessage(`You voted '${updated.content}'`);
      } catch (error) {
        showErrorMessage(
          error?.message || `failed to vote for ${anecdote.content}`,
        );
      }
    },

    add: async (content) => {
      const { showSuccessMessage, showErrorMessage } =
        useNotificationStore.getState().actions;
      try {
        const newAnecdote = await anecdoteService.createNew(content);
        set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }));
        showSuccessMessage(`${newAnecdote.content} is added.`);
      } catch (error) {
        showErrorMessage(error?.message || `failed to add ${content}`);
      }
    },

    sort: () =>
      set((state) => ({
        anecdotes: state.anecdotes.toSorted((a, b) => b.votes - a.votes),
      })),

    setFilter: (value) => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll();
      set(() => ({ anecdotes }));
    },

    remove: async (id) => {
      const { showSuccessMessage, showErrorMessage } =
        useNotificationStore.getState().actions;

      const anecdote = get().anecdotes.find((a) => a.id === id);
      if (!anecdote) {
        showErrorMessage(`Anecdote not found`);
        return;
      }

      if (anecdote.vote > 0) {
        showErrorMessage(`Not possible to delete the anecdote`);
        return;
      }

      if (window.confirm(`Remove anecdote ${anecdote.content}`)) {
        try {
          const updated = await anecdoteService.remove(id);
          set((state) => ({
            anecdotes: state.anecdotes.filter((anecdote) => anecdote.id != id),
          }));
          showSuccessMessage(`You delete '${updated.content}'`);
        } catch (error) {
          showErrorMessage(error?.message || `failed to delete`);
        }
      }
    },
  },
}));

export const useAnecdotes = () =>
  useAnecdoteStore(
    useShallow(({ anecdotes, filter }) => {
      return anecdotes.filter((acnedote) =>
        acnedote.content.toLowerCase().includes(filter.toLowerCase()),
      );
    }),
  );
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export default useAnecdoteStore;
