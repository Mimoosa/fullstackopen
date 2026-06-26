import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("./services/anecdotes", () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import anecdoteService from "./services/anecdotes";
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from "./store";

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  vi.clearAllMocks();
});

describe("useAnecdoteActions", () => {
  it("initializes loads anecdotes from service", async () => {
    const mockAnecdotes = [{ id: 1, content: "Test", votes: 0 }];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      await result.current.initialize();
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current).toEqual(mockAnecdotes);
  });

  it("adds appends a new anecdote", async () => {
    const newAnecdote = { id: 2, content: "New anecdote", votes: 0 };
    anecdoteService.createNew.mockResolvedValue(newAnecdote);

    const { result } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      await result.current.add("New anecdote");
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current).toContainEqual(newAnecdote);
  });

  it("sorts anecdotes by votes", () => {
    const anecdotes = [
      { id: 1, content: "A", votes: 0 },
      { id: 2, content: "B", votes: 1 },
      { id: 3, content: "C", votes: 2 },
    ];

    useAnecdoteStore.setState({ anecdotes });

    const { result } = renderHook(() => useAnecdoteActions());
    act(() => {
      result.current.sort();
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current[0]).toEqual(anecdotes[2]);
    expect(anecdotesResult.current[1]).toEqual(anecdotes[1]);
    expect(anecdotesResult.current[2]).toEqual(anecdotes[0]);
  });

  describe("useAnecdotes filtering", () => {
    const anecdotes = [
      { id: 1, content: "A", votes: 0 },
      { id: 2, content: "B", votes: 1 },
    ];

    beforeEach(() => {
      useAnecdoteStore.setState({ anecdotes });
    });

    it("returns all anecdotes with no filter", () => {
      const { result } = renderHook(() => useAnecdotes());
      expect(result.current).toHaveLength(2);
    });

    it("filters aencdotes which include A", () => {
      useAnecdoteStore.setState({ anecdotes, filter: "A" });
      const { result } = renderHook(() => useAnecdotes());
      expect(result.current).toEqual([anecdotes[0]]);
    });

    it("filters aencdotes which include B", () => {
      useAnecdoteStore.setState({ anecdotes, filter: "B" });
      const { result } = renderHook(() => useAnecdotes());
      expect(result.current).toEqual([anecdotes[1]]);
    });
  });

  it("increases the number of votes for an anecdote", async () => {
    const anecdotes = [{ id: 1, content: "A", votes: 0 }];

    useAnecdoteStore.setState({ anecdotes });

    anecdoteService.update.mockResolvedValue({
      id: 1,
      content: "A",
      votes: 1,
    });

    const { result } = renderHook(() => useAnecdoteActions());
    await act(async () => {
      await result.current.vote(1);
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current[0].votes).toEqual(anecdotes[0].votes + 1);
  });
});
