import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setTodosActionCreator,
  asyncSetTodos,
  setTodoActionCreator,
  setIsTodoActionCreator,
  asyncSetTodo,
  setIsTodoAddActionCreator,
  setIsTodoAddedActionCreator,
  asyncSetIsTodoAdd,
  setIsTodoChangeActionCreator,
  setIsTodoChangedActionCreator,
  asyncSetIsTodoChange,
  setIsTodoChangeCoverActionCreator,
  setIsTodoChangedCoverActionCreator,
  asyncSetIsTodoChangeCover,
  setIsTodoDeleteActionCreator,
  setIsTodoDeletedActionCreator,
  asyncSetIsTodoDelete,
} from "./action";
import todoApi from "../api/todoApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("todos action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create action objects correctly", () => {
    expect(setTodosActionCreator([{ id: 1 }])).toEqual({
      type: ActionType.SET_TODOS,
      payload: [{ id: 1 }],
    });
    expect(setTodoActionCreator({ id: 1 })).toEqual({
      type: ActionType.SET_TODO,
      payload: { id: 1 },
    });
    expect(setIsTodoActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO,
      payload: true,
    });
    expect(setIsTodoAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_ADD,
      payload: true,
    });
    expect(setIsTodoAddedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_ADDED,
      payload: true,
    });
    expect(setIsTodoChangeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_CHANGE,
      payload: true,
    });
    expect(setIsTodoChangedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_CHANGED,
      payload: true,
    });
    expect(setIsTodoChangeCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_CHANGE_COVER,
      payload: true,
    });
    expect(setIsTodoChangedCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_CHANGED_COVER,
      payload: true,
    });
    expect(setIsTodoDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_DELETE,
      payload: true,
    });
    expect(setIsTodoDeletedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_TODO_DELETED,
      payload: true,
    });
  });

  describe("asyncSetTodos", () => {
    it("should dispatch setTodosActionCreator on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "getTodos").mockResolvedValue([{ id: 1 }]);

      await asyncSetTodos("1")(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setTodosActionCreator([{ id: 1 }]));
    });

    it("should dispatch empty array on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "getTodos").mockRejectedValue(new Error("Err"));

      await asyncSetTodos()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setTodosActionCreator([]));
    });
  });

  describe("asyncSetTodo", () => {
    it("should dispatch setTodoActionCreator and setIsTodo on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "getTodoById").mockResolvedValue({ id: 1 });

      await asyncSetTodo(1)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setTodoActionCreator({ id: 1 }));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoActionCreator(true));
    });

    it("should dispatch null and setIsTodo on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "getTodoById").mockRejectedValue(new Error("Err"));

      await asyncSetTodo(99)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setTodoActionCreator(null));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoActionCreator(true));
    });
  });

  describe("asyncSetIsTodoAdd", () => {
    it("should post todo, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "postTodo").mockResolvedValue({ todo_id: 1 });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await asyncSetIsTodoAdd("Title", "Desc")(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Todo berhasil ditambahkan!");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoAddedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoAddActionCreator(true));
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "postTodo").mockRejectedValue(new Error("Gagal tambah"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await asyncSetIsTodoAdd("Title", "Desc")(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal tambah");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoAddedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoAddActionCreator(true));
    });
  });

  describe("asyncSetIsTodoChange", () => {
    it("should update todo, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "putTodo").mockResolvedValue("Todo diubah");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await asyncSetIsTodoChange(1, "Title", "Desc", true)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Todo diubah");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangeActionCreator(true));
    });

    it("should use fallback success message when api returns empty string", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "putTodo").mockResolvedValue("");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await asyncSetIsTodoChange(1, "Title", "Desc", true)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Todo berhasil diperbarui!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "putTodo").mockRejectedValue(new Error("Gagal update"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await asyncSetIsTodoChange(1, "Title", "Desc", true)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal update");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangeActionCreator(true));
    });
  });

  describe("asyncSetIsTodoChangeCover", () => {
    it("should upload cover, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "postTodoCover").mockResolvedValue("Cover diubah");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      const dummyFile = new File([""], "cover.jpg");
      await asyncSetIsTodoChangeCover(1, dummyFile)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Cover diubah");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangedCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangeCoverActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "postTodoCover").mockResolvedValue("");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      const dummyFile = new File([""], "cover.jpg");
      await asyncSetIsTodoChangeCover(1, dummyFile)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Cover berhasil diperbarui!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "postTodoCover").mockRejectedValue(new Error("File corrupt"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      const dummyFile = new File([""], "cover.jpg");
      await asyncSetIsTodoChangeCover(1, dummyFile)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("File corrupt");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangedCoverActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoChangeCoverActionCreator(true));
    });
  });

  describe("asyncSetIsTodoDelete", () => {
    it("should delete todo, show success dialog, and dispatch success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "deleteTodo").mockResolvedValue("Todo dihapus");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await asyncSetIsTodoDelete(1)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Todo dihapus");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoDeletedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoDeleteActionCreator(true));
    });

    it("should use fallback success message if empty", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "deleteTodo").mockResolvedValue("");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      await asyncSetIsTodoDelete(1)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Todo berhasil dihapus!");
    });

    it("should show error dialog and dispatch false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(todoApi, "deleteTodo").mockRejectedValue(new Error("Gagal hapus"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await asyncSetIsTodoDelete(1)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal hapus");
      expect(dispatch).toHaveBeenCalledWith(setIsTodoDeletedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsTodoDeleteActionCreator(true));
    });
  });
});
