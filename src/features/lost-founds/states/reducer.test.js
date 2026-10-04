import { describe, it, expect } from "vitest";
import {
  todosReducer,
  todoReducer,
  isTodoReducer,
  isTodoAddReducer,
  isTodoAddedReducer,
  isTodoChangeReducer,
  isTodoChangedReducer,
  isTodoChangeCoverReducer,
  isTodoChangedCoverReducer,
  isTodoDeleteReducer,
  isTodoDeletedReducer,
} from "./reducer";
import { ActionType } from "./action";

describe("todos reducer", () => {
  it("should return the default state for unknown actions", () => {
    expect(todosReducer(undefined, {})).toEqual([]);
    expect(todoReducer(undefined, {})).toBeNull();
    expect(isTodoReducer(undefined, {})).toBe(false);
    expect(isTodoAddReducer(undefined, {})).toBe(false);
    expect(isTodoAddedReducer(undefined, {})).toBe(false);
    expect(isTodoChangeReducer(undefined, {})).toBe(false);
    expect(isTodoChangedReducer(undefined, {})).toBe(false);
    expect(isTodoChangeCoverReducer(undefined, {})).toBe(false);
    expect(isTodoChangedCoverReducer(undefined, {})).toBe(false);
    expect(isTodoDeleteReducer(undefined, {})).toBe(false);
    expect(isTodoDeletedReducer(undefined, {})).toBe(false);
  });

  it("should handle SET_TODOS", () => {
    const action = { type: ActionType.SET_TODOS, payload: [{ id: 1 }] };
    expect(todosReducer([], action)).toEqual([{ id: 1 }]);
  });

  it("should handle SET_TODO", () => {
    const action = { type: ActionType.SET_TODO, payload: { id: 1 } };
    expect(todoReducer(null, action)).toEqual({ id: 1 });
  });

  it("should handle SET_IS_TODO", () => {
    const action = { type: ActionType.SET_IS_TODO, payload: true };
    expect(isTodoReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_ADD", () => {
    const action = { type: ActionType.SET_IS_TODO_ADD, payload: true };
    expect(isTodoAddReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_ADDED", () => {
    const action = { type: ActionType.SET_IS_TODO_ADDED, payload: true };
    expect(isTodoAddedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_CHANGE", () => {
    const action = { type: ActionType.SET_IS_TODO_CHANGE, payload: true };
    expect(isTodoChangeReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_CHANGED", () => {
    const action = { type: ActionType.SET_IS_TODO_CHANGED, payload: true };
    expect(isTodoChangedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_CHANGE_COVER", () => {
    const action = { type: ActionType.SET_IS_TODO_CHANGE_COVER, payload: true };
    expect(isTodoChangeCoverReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_CHANGED_COVER", () => {
    const action = { type: ActionType.SET_IS_TODO_CHANGED_COVER, payload: true };
    expect(isTodoChangedCoverReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_DELETE", () => {
    const action = { type: ActionType.SET_IS_TODO_DELETE, payload: true };
    expect(isTodoDeleteReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_TODO_DELETED", () => {
    const action = { type: ActionType.SET_IS_TODO_DELETED, payload: true };
    expect(isTodoDeletedReducer(false, action)).toBe(true);
  });
});
