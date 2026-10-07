import { describe, expect, it, vi, beforeEach } from "vitest";
import { createMutationThunk, createFlagReducer } from "./thunkHelper";
import * as toolsHelper from "./toolsHelper";

describe("thunkHelper", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("createMutationThunk", () => {
    it("should handle successful execution and show success dialog", async () => {
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue(true);
      const setStart = vi.fn((val) => ({ type: "SET_START", payload: val }));
      const setDone = vi.fn((val) => ({ type: "SET_DONE", payload: val }));
      const run = vi.fn().mockResolvedValue("Berhasil disimpan");

      const thunk = createMutationThunk({
        setStart,
        setDone,
        run,
        showSuccess: true,
      });

      const dispatch = vi.fn();
      const result = await thunk(dispatch);

      expect(result).toBe(true);
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_START", payload: true });
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_DONE", payload: false });
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_DONE", payload: true });
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_START", payload: false });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Berhasil disimpan");
    });

    it("should handle successful execution without success dialog when showSuccess is false", async () => {
      const showSuccessSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue(true);
      const setStart = vi.fn((val) => ({ type: "SET_START", payload: val }));
      const run = vi.fn().mockResolvedValue("Berhasil disimpan");

      const thunk = createMutationThunk({
        setStart,
        run,
        showSuccess: false,
      });

      const dispatch = vi.fn();
      const result = await thunk(dispatch);

      expect(result).toBe(true);
      expect(showSuccessSpy).not.toHaveBeenCalled();
    });

    it("should handle error execution and show error dialog", async () => {
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue(true);
      const setStart = vi.fn((val) => ({ type: "SET_START", payload: val }));
      const setDone = vi.fn((val) => ({ type: "SET_DONE", payload: val }));
      const run = vi.fn().mockRejectedValue(new Error("Gagal menyimpan"));

      const thunk = createMutationThunk({
        setStart,
        setDone,
        run,
      });

      const dispatch = vi.fn();
      const result = await thunk(dispatch);

      expect(result).toBe(false);
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_DONE", payload: false });
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_START", payload: false });
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Gagal menyimpan");
    });
  });

  describe("createFlagReducer", () => {
    it("should create a reducer that responds to specific action type and handles defaults", () => {
      const reducer = createFlagReducer("TEST_FLAG", false);
      expect(reducer(undefined, {})).toBe(false);
      expect(reducer(false, { type: "OTHER" })).toBe(false);
      expect(reducer(false, { type: "TEST_FLAG", payload: true })).toBe(true);
      expect(reducer(true, { type: "TEST_FLAG", payload: false })).toBe(false);
    });

    it("should use default initialValue of false when not passed", () => {
      const reducer = createFlagReducer("TEST_DEFAULT");
      expect(reducer(undefined, {})).toBe(false);
    });
  });
});
