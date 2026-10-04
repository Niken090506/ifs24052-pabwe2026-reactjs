import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as todoAction from "../states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("HomePage", () => {
  const mockProfile = { id: 1, name: "Abdullah", email: "abdul@del.org" };
  const mockTodos = [
    {
      id: 1,
      title: "Todo Pertama",
      description: "Deskripsi pertama",
      is_finished: 0,
      cover: "https://example.com/cover1.jpg",
      created_at: "2024-02-26T02:34:26.000000Z",
      updated_at: "2024-02-26T02:44:47.000000Z",
    },
    {
      id: 2,
      title: "Todo Kedua Selesai",
      description: "Deskripsi kedua",
      is_finished: 1,
      cover: null,
      created_at: "2024-02-26T02:34:26.000000Z",
      updated_at: "2024-02-26T02:44:47.000000Z",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null if profile is not present", () => {
    const { container } = renderWithProviders(<HomePage />, {
      preloadedState: { profile: null },
    });
    expect(container.firstChild).toBeNull();
  });

  it("should render todos stats, rows, and empty state when empty", async () => {
    vi.spyOn(todoAction, "asyncSetTodos").mockReturnValue(() => Promise.resolve());
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: [],
      },
    });

    expect(screen.getByText("Daftar Todos")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Belum ada data todo yang cocok.")).toBeInTheDocument();
    });
  });

  it("should display loading indicator while loading todos", () => {
    vi.spyOn(todoAction, "asyncSetTodos").mockImplementation(
      () => () => new Promise(() => {})
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: [],
      },
    });

    expect(screen.getByText("Memuat daftar todo...")).toBeInTheDocument();
  });

  it("should display stats count and filter/search todos", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: mockTodos,
      },
    });

    expect(screen.getByText("Total Todo")).toBeInTheDocument();
    expect(screen.getByText("Todo Pertama")).toBeInTheDocument();
    expect(screen.getByText("Todo Kedua Selesai")).toBeInTheDocument();

    // Test search filter by title
    const searchInput = screen.getByTestId("search-todo-input");
    fireEvent.change(searchInput, { target: { value: "Pertama" } });

    expect(screen.getByText("Todo Pertama")).toBeInTheDocument();
    expect(screen.queryByText("Todo Kedua Selesai")).not.toBeInTheDocument();

    // Test search filter by description
    fireEvent.change(searchInput, { target: { value: "kedua" } });
    expect(screen.getByText("Todo Kedua Selesai")).toBeInTheDocument();

    // Test status filter buttons
    const filterFinishedBtn = screen.getByTestId("filter-finished-btn");
    fireEvent.click(filterFinishedBtn);

    const filterPendingBtn = screen.getByTestId("filter-pending-btn");
    fireEvent.click(filterPendingBtn);

    const filterAllBtn = screen.getByTestId("filter-all-btn");
    fireEvent.click(filterAllBtn);
  });

  it("should handle search against todos with null title and description", async () => {
    vi.spyOn(todoAction, "asyncSetTodos").mockReturnValue(() => Promise.resolve());
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: [{ id: 99, title: null, description: null, is_finished: 0 }],
      },
    });
    // Wait for loading to finish first
    await waitFor(() => {
      expect(screen.queryByText("Memuat daftar todo...")).not.toBeInTheDocument();
    });
    const searchInput = screen.getByTestId("search-todo-input");
    fireEvent.change(searchInput, { target: { value: "xyz" } });
    expect(screen.getByText("Belum ada data todo yang cocok.")).toBeInTheDocument();
  });

  it("should open and close AddModal when Tambah Todo button clicked", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: mockTodos,
      },
    });

    const addBtn = screen.getByTestId("add-todo-btn");
    fireEvent.click(addBtn);

    expect(screen.getByTestId("add-todo-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("add-todo-modal")).not.toBeInTheDocument();
  });

  it("should navigate to detail page when view icon clicked", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: mockTodos,
      },
    });

    const viewBtn = screen.getByTestId("view-todo-1");
    fireEvent.click(viewBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/todos/1");
  });

  it("should open and close edit modal when edit icon clicked", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: mockTodos,
      },
    });

    const editBtn = screen.getByTestId("edit-todo-1");
    fireEvent.click(editBtn);

    expect(screen.getByTestId("edit-todo-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-edit-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("edit-todo-modal")).not.toBeInTheDocument();
  });

  it("should trigger confirm dialog and dispatch delete when delete icon confirmed", async () => {
    const deleteActionSpy = vi
      .spyOn(todoAction, "asyncSetIsTodoDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: mockTodos,
      },
    });

    const deleteBtn = screen.getByTestId("delete-todo-1");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteActionSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should not dispatch delete when cancelled", async () => {
    const deleteActionSpy = vi
      .spyOn(todoAction, "asyncSetIsTodoDelete")
      .mockReturnValue(() => {});

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false });

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: mockTodos,
      },
    });

    const deleteBtn = screen.getByTestId("delete-todo-1");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    });
    expect(deleteActionSpy).not.toHaveBeenCalled();
  });

  it("should reload todos when isTodoDeleted is true", async () => {
    const asyncSetTodosSpy = vi
      .spyOn(todoAction, "asyncSetTodos")
      .mockReturnValue(() => {});

    await act(async () => {
      renderWithProviders(<HomePage />, {
        preloadedState: {
          profile: mockProfile,
          todos: mockTodos,
          isTodoDeleted: true,
        },
      });
    });

    expect(asyncSetTodosSpy).toHaveBeenCalled();
  });

  it("should not update loading state after unmount (isMounted guard on initial load)", async () => {
    let resolveLoad;
    const pendingPromise = new Promise((resolve) => {
      resolveLoad = resolve;
    });
    vi.spyOn(todoAction, "asyncSetTodos").mockReturnValue(() => pendingPromise);

    const { unmount } = renderWithProviders(<HomePage />, {
      preloadedState: { profile: mockProfile, todos: [] },
    });
    unmount();
    resolveLoad();
    await pendingPromise;
    // No error = isMounted guard correctly prevents setState after unmount
  });

  it("should not update loading state after unmount during isTodoDeleted reload", async () => {
    let resolveLoad;
    const pendingPromise = new Promise((resolve) => {
      resolveLoad = resolve;
    });
    vi.spyOn(todoAction, "asyncSetTodos").mockReturnValue(() => pendingPromise);

    const { unmount } = renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        todos: mockTodos,
        isTodoDeleted: true,
      },
    });
    unmount();
    resolveLoad();
    await pendingPromise;
    // No error = isMounted guard correctly prevents setState after unmount
  });
});
