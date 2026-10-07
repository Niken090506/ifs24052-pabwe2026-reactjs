import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { renderWithProviders } from "../../../test-utils";
import * as userAction from "../states/action";

describe("UsersPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockUsers = [
    {
      id: 1,
      name: "Abdullah",
      email: "abdullah@delcom.org",
      photo: "https://example.com/photo.jpg",
      created_at: "2024-10-05T02:53:38.000000Z",
    },
    {
      id: 2,
      name: "Ubaid",
      email: "ubaid@delcom.org",
      photo: null,
      created_at: "2024-10-05T03:18:14.000000Z",
    },
    {
      id: 3,
      name: "",
      email: "",
      photo: null,
      created_at: "2024-10-05T03:18:14.000000Z",
    },
  ];

  it("should render users list, fallback initial avatar, and search users", async () => {
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: mockUsers,
      },
    });

    await waitFor(() => {
      expect(screen.queryByText("Memuat pengguna…")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Abdullah")).toBeInTheDocument();
    expect(screen.getByText("Ubaid")).toBeInTheDocument();
    expect(screen.getAllByText("U").length).toBeGreaterThan(0); // initial avatar fallback

    const searchInput = screen.getByLabelText("Cari pengguna");
    fireEvent.change(searchInput, { target: { value: "abdullah" } });

    expect(screen.getByText("Abdullah")).toBeInTheDocument();
    expect(screen.queryByText("Ubaid")).not.toBeInTheDocument();
  });

  it("should handle state when users in store is null/empty", async () => {
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: [],
      },
    });

    await waitFor(() => {
      expect(screen.queryByText("Memuat pengguna…")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
  });

  it("should show empty state when no users found and not loading", async () => {
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue(() => Promise.resolve());
    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: [],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Tidak ada pengguna yang cocok.")
      ).toBeInTheDocument();
    });
  });

  it("should show loading indicator while users are being fetched", () => {
    vi.spyOn(userAction, "asyncSetUsers").mockImplementation(
      () => () => new Promise(() => {})
    );

    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: [],
      },
    });

    expect(screen.getByRole("status")).toHaveTextContent("Memuat pengguna…");
  });

  it("should not update loading state after unmount (isMounted guard)", async () => {
    let resolveLoad;
    const pendingPromise = new Promise((resolve) => {
      resolveLoad = resolve;
    });
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue(() => pendingPromise);

    const { unmount } = renderWithProviders(<UsersPage />, {
      preloadedState: { users: [] },
    });
    unmount();
    resolveLoad();
    await pendingPromise;
  });
});
