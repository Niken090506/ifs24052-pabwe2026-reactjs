import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import LostFoundLayout from "./LostFoundLayout";
import { renderWithProviders } from "../../../test-utils";
import apiHelper from "../../../helpers/apiHelper";
import * as authAction from "../../auth/states/action";
import * as userAction from "../../users/states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LostFoundLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to login if access token does not exist", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<LostFoundLayout />);

    expect(screen.queryByText("Lost & Founds")).not.toBeInTheDocument();
  });

  it("should render layout and dispatch asyncSetProfile when token exists", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const setProfileSpy = vi
      .spyOn(userAction, "asyncSetProfile")
      .mockReturnValue(() => Promise.resolve(true));

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: {
        profile: {
          id: 1,
          name: "Test User",
          email: "test@delcom.org",
        },
      },
    });

    expect(screen.getByText("Lost & Founds")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(setProfileSpy).toHaveBeenCalled();
  });

  it("should redirect to login when asyncSetProfile fails", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("invalid-token");
    const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken").mockImplementation(() => {});
    vi.spyOn(userAction, "asyncSetProfile").mockReturnValue(() => Promise.resolve(false));

    renderWithProviders(<LostFoundLayout />);

    await waitFor(() => {
      expect(putTokenSpy).toHaveBeenCalledWith("");
      expect(mockNavigate).toHaveBeenCalledWith("/auth/login", { replace: true });
    });
  });

  it("should toggle mobile sidebar and handle logout", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    vi.spyOn(userAction, "asyncSetProfile").mockReturnValue(() => Promise.resolve(true));
    const logoutSpy = vi
      .spyOn(authAction, "asyncSetIsAuthLogout")
      .mockReturnValue(() => Promise.resolve());

    renderWithProviders(<LostFoundLayout />, {
      preloadedState: {
        profile: {
          id: 1,
          name: "Test User",
          email: "test@delcom.org",
        },
      },
    });

    // Toggle sidebar
    const toggleBtn = screen.getByRole("button", { name: "Buka menu navigasi" });
    fireEvent.click(toggleBtn);

    // Close sidebar backdrop
    const backdrop = screen.getByRole("button", { name: "Tutup menu navigasi" });
    fireEvent.click(backdrop);

    // Open profile menu and click logout
    const profileBtn = screen.getByRole("button", { name: /Test User/ });
    fireEvent.click(profileBtn);

    const logoutBtn = screen.getByRole("button", { name: "Keluar" });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(logoutSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/auth/login", { replace: true });
    });
  });
});
