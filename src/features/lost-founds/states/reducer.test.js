import { describe, it, expect } from "vitest";
import {
  lostFoundsReducer,
  lostFoundReducer,
  lostFoundStatsReducer,
  isLostFoundReducer,
  isLostFoundAddReducer,
  isLostFoundAddedReducer,
  isLostFoundChangeReducer,
  isLostFoundChangedReducer,
  isLostFoundChangeCoverReducer,
  isLostFoundChangedCoverReducer,
  isLostFoundDeleteReducer,
  isLostFoundDeletedReducer,
} from "./reducer";
import { ActionType } from "./action";

describe("lost found reducers", () => {
  it("should return default states for unknown actions", () => {
    expect(lostFoundsReducer(undefined, {})).toEqual([]);
    expect(lostFoundReducer(undefined, {})).toBeNull();
    expect(lostFoundStatsReducer(undefined, {})).toBeNull();

    expect(isLostFoundReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddedReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeleteReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeletedReducer(undefined, {})).toBe(false);
  });

  it("should handle SET_LOST_FOUNDS", () => {
    const action = {
      type: ActionType.SET_LOST_FOUNDS,
      payload: [{ id: 1 }],
    };

    expect(lostFoundsReducer([], action)).toEqual([{ id: 1 }]);
  });

  it("should handle SET_LOST_FOUND", () => {
    const action = {
      type: ActionType.SET_LOST_FOUND,
      payload: { id: 1 },
    };

    expect(lostFoundReducer(null, action)).toEqual({ id: 1 });
  });

  it("should handle SET_LOST_FOUND_STATS", () => {
    const stats = {
      daily: [{ date: "2026-10-01", total: 2 }],
      monthly: [{ month: "2026-10", total: 5 }],
    };

    const action = {
      type: ActionType.SET_LOST_FOUND_STATS,
      payload: stats,
    };

    expect(lostFoundStatsReducer(null, action)).toEqual(stats);
  });

  it("should handle SET_IS_LOST_FOUND", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND,
      payload: true,
    };

    expect(isLostFoundReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_ADD", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_ADD,
      payload: true,
    };

    expect(isLostFoundAddReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_ADDED", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_ADDED,
      payload: true,
    };

    expect(isLostFoundAddedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGE", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_CHANGE,
      payload: true,
    };

    expect(isLostFoundChangeReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGED", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_CHANGED,
      payload: true,
    };

    expect(isLostFoundChangedReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGE_COVER", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
      payload: true,
    };

    expect(isLostFoundChangeCoverReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_CHANGED_COVER", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
      payload: true,
    };

    expect(isLostFoundChangedCoverReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_DELETE", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_DELETE,
      payload: true,
    };

    expect(isLostFoundDeleteReducer(false, action)).toBe(true);
  });

  it("should handle SET_IS_LOST_FOUND_DELETED", () => {
    const action = {
      type: ActionType.SET_IS_LOST_FOUND_DELETED,
      payload: true,
    };

    expect(isLostFoundDeletedReducer(false, action)).toBe(true);
  });
});