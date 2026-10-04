import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as todoAction from "../states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ todoId: "1" }),
  };
});

describe("DetailPage", () => {
  const mockProfile = { id: 1, name: "Abdullah", email: "abdul@del.org" };
  const mockTodo = {
    id: 1,
    title: "Detail Todo Judul",
    description: "Detail Todo Deskripsi",
    is_finished: 1,
    cover: "https://example.com/cover.jpg",
    created_at: "2024-02-26T02:34:26.000000Z",
    updated_at: "2024-02-26T02:44:47.000000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading spinner if profile or todo is missing", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: null,
        todo: null,
      },
    });

    expect(screen.queryByText("Detail Todo Judul")).not.toBeInTheDocument();
  });

  it("should render todo details correctly and support closing cover & edit modals", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        todo: mockTodo,
      },
    });

    expect(screen.getByText("Detail Todo Judul")).toBeInTheDocument();
    expect(screen.getByText("Detail Todo Deskripsi")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();

    // Open & close cover modal
    const editCoverBtn = screen.getByTestId("edit-cover-btn");
    fireEvent.click(editCoverBtn);
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-cover-modal-btn"));
    expect(screen.queryByTestId("change-cover-modal")).not.toBeInTheDocument();

    // Open & close edit modal
    const editDetailBtn = screen.getByTestId("edit-detail-todo-btn");
    fireEvent.click(editDetailBtn);
    expect(screen.getByTestId("edit-todo-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-edit-modal-btn"));
    expect(screen.queryByTestId("edit-todo-modal")).not.toBeInTheDocument();
  });

  it("should render unfinished badge when todo is not finished and handle description fallback", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        todo: {
          ...mockTodo,
          is_finished: 0,
          description: "",
          cover: null,
        },
      },
    });

    expect(screen.getByText("Sedang Proses")).toBeInTheDocument();
    expect(screen.getByText("Tidak ada deskripsi rinci untuk todo ini.")).toBeInTheDocument();
  });

  it("should trigger confirm dialog and dispatch delete on delete button click when confirmed", async () => {
    const deleteSpy = vi
      .spyOn(todoAction, "asyncSetIsTodoDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        todo: mockTodo,
      },
    });

    const deleteBtn = screen.getByTestId("delete-detail-todo-btn");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should not dispatch delete when cancelled", async () => {
    const deleteSpy = vi
      .spyOn(todoAction, "asyncSetIsTodoDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        todo: mockTodo,
      },
    });

    const deleteBtn = screen.getByTestId("delete-detail-todo-btn");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    });
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should navigate back to home if isTodo is true and todo is null", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        todo: null,
        isTodo: true,
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should stay when isTodo is true and todo exists", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        todo: mockTodo,
        isTodo: true,
      },
    });

    expect(screen.getByText("Detail Todo Judul")).toBeInTheDocument();
  });

  it("should navigate back to home if isTodoDeleted is true", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        todo: mockTodo,
        isTodoDeleted: true,
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
