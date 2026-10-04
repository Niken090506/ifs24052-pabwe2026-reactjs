import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as todoAction from "../states/action";

describe("ChangeModal", () => {
  const mockTodo = {
    id: 1,
    title: "Initial Title",
    description: "Initial Desc",
    is_finished: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { container } = renderWithProviders(
      <ChangeModal show={false} onClose={vi.fn()} todoId={1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should populate inputs with todo data and handle changes", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} todoId={1} />, {
      preloadedState: {
        todo: mockTodo,
      },
    });

    const titleInput = screen.getByTestId("edit-todo-title-input");
    const descInput = screen.getByTestId("edit-todo-description-input");
    const statusSelect = screen.getByTestId("edit-todo-status-select");

    expect(titleInput.value).toBe("Initial Title");
    expect(descInput.value).toBe("Initial Desc");
    expect(statusSelect.value).toBe("0");

    fireEvent.change(statusSelect, { target: { value: "1" } });
    expect(statusSelect.value).toBe("1");
  });

  it("should handle empty title and description in todo object", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} todoId={1} />, {
      preloadedState: {
        todo: { id: 1, title: null, description: null, is_finished: 1 },
      },
    });

    expect(screen.getByTestId("edit-todo-title-input").value).toBe("");
  });

  it("should validate empty title and empty description", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} todoId={1} />, {
      preloadedState: {
        todo: mockTodo,
      },
    });

    const titleInput = screen.getByTestId("edit-todo-title-input");
    const form = titleInput.closest("form");

    fireEvent.change(titleInput, { target: { value: "   " } });
    fireEvent.submit(form);
    expect(errorSpy).toHaveBeenCalledWith("Judul tidak boleh kosong");

    fireEvent.change(titleInput, { target: { value: "Valid Title" } });
    const descInput = screen.getByTestId("edit-todo-description-input");
    fireEvent.change(descInput, { target: { value: "   " } });
    fireEvent.submit(form);
    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should dispatch asyncSetIsTodoChange and close on success", () => {
    const changeSpy = vi.spyOn(todoAction, "asyncSetIsTodoChange").mockReturnValue(() => {});
    const onClose = vi.fn();

    renderWithProviders(<ChangeModal show={true} onClose={onClose} todoId={1} />, {
      preloadedState: {
        todo: mockTodo,
        isTodoChange: false,
        isTodoChanged: false,
      },
    });

    const form = screen.getByTestId("edit-todo-title-input").closest("form");
    fireEvent.submit(form);

    expect(changeSpy).toHaveBeenCalledWith(1, "Initial Title", "Initial Desc", 0);

    // Simulate completion with isTodoChanged true
    renderWithProviders(<ChangeModal show={true} onClose={onClose} todoId={1} />, {
      preloadedState: {
        todo: mockTodo,
        isTodoChange: true,
        isTodoChanged: true,
      },
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("should dispatch asyncSetIsTodoChange with 1 when isFinished is true", () => {
    const changeSpy = vi.spyOn(todoAction, "asyncSetIsTodoChange").mockReturnValue(() => {});

    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} todoId={1} />, {
      preloadedState: {
        todo: { ...mockTodo, is_finished: 1 },
      },
    });

    const form = screen.getByTestId("edit-todo-title-input").closest("form");
    fireEvent.submit(form);

    expect(changeSpy).toHaveBeenCalledWith(1, "Initial Title", "Initial Desc", 1);
  });

  it("should handle isTodoChange true when isTodoChanged is false", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} todoId={1} />, {
      preloadedState: {
        todo: mockTodo,
        isTodoChange: true,
        isTodoChanged: false,
      },
    });

    expect(screen.getByTestId("edit-todo-title-input")).toBeInTheDocument();
  });

  it("should trigger onClose on cancel or close button click", () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal show={true} onClose={onClose} todoId={1} />, {
      preloadedState: {
        todo: mockTodo,
      },
    });

    fireEvent.click(screen.getByTestId("close-edit-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("cancel-edit-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
