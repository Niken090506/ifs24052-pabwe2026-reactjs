import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as todoAction from "../states/action";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { container } = renderWithProviders(<AddModal show={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("should show validation error if title is empty", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    const form = screen.getByTestId("add-todo-modal").querySelector("form");
    fireEvent.submit(form);

    expect(errorSpy).toHaveBeenCalledWith("Judul tidak boleh kosong");
  });

  it("should show validation error if description is empty", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    const titleInput = screen.getByTestId("add-todo-title-input");
    fireEvent.change(titleInput, { target: { value: "Judul Todo" } });

    const form = screen.getByTestId("add-todo-modal").querySelector("form");
    fireEvent.submit(form);

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should dispatch asyncSetIsTodoAdd and call onClose on successful add", () => {
    const asyncAddSpy = vi.spyOn(todoAction, "asyncSetIsTodoAdd").mockReturnValue(() => {});
    const onClose = vi.fn();

    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isTodoAdd: false,
        isTodoAdded: false,
      },
    });

    const titleInput = screen.getByTestId("add-todo-title-input");
    const descInput = screen.getByTestId("add-todo-description-input");

    fireEvent.change(titleInput, { target: { value: "Belajar Vitest" } });
    fireEvent.change(descInput, { target: { value: "Belajar sampai coverage 100%" } });

    const form = screen.getByTestId("add-todo-modal").querySelector("form");
    fireEvent.submit(form);

    expect(asyncAddSpy).toHaveBeenCalledWith("Belajar Vitest", "Belajar sampai coverage 100%");

    // Simulate completion from store
    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isTodoAdd: true,
        isTodoAdded: true,
      },
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("should handle isTodoAdd true when isTodoAdded is false", () => {
    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />, {
      preloadedState: {
        isTodoAdd: true,
        isTodoAdded: false,
      },
    });

    expect(screen.getByTestId("add-todo-modal")).toBeInTheDocument();
  });

  it("should close modal when close or cancel button clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal show={true} onClose={onClose} />);

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByTestId("cancel-add-modal-btn");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
