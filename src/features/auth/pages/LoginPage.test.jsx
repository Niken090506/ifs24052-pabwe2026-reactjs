import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import LoginPage, { validateLogin } from "./LoginPage";
import { renderWithProviders } from "../../../test-utils";
import * as authAction from "../states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateLogin helper", () => {
    it("should validate empty email and password", () => {
      const errors = validateLogin("", "");
      expect(errors.email).toBe("Email wajib diisi.");
      expect(errors.password).toBe("Kata sandi wajib diisi.");
    });

    it("should validate invalid email format", () => {
      const errors = validateLogin("notanemail", "password123");
      expect(errors.email).toBe("Format email tidak valid.");
      expect(errors.password).toBeUndefined();
    });

    it("should return empty errors for valid input", () => {
      const errors = validateLogin("user@delcom.org", "password123");
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  it("should render inputs and handle submit", async () => {
    const loginSpy = vi
      .spyOn(authAction, "asyncSetIsAuthLogin")
      .mockReturnValue(() => Promise.resolve());

    renderWithProviders(<LoginPage />, {
      preloadedState: {
        isAuthLogin: false,
      },
    });

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Kata sandi");
    const submitBtn = screen.getByRole("button", { name: "Masuk" });

    fireEvent.change(emailInput, { target: { value: "testing@delcom.org" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(loginSpy).toHaveBeenCalledWith("testing@delcom.org", "123456");
  });

  it("should not call asyncSetIsAuthLogin if validation fails", async () => {
    const loginSpy = vi
      .spyOn(authAction, "asyncSetIsAuthLogin")
      .mockReturnValue(() => Promise.resolve());

    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole("button", { name: "Masuk" });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(loginSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Email wajib diisi.")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi wajib diisi.")).toBeInTheDocument();
  });

  it("should navigate to / when isAuthLogin is true", () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        isAuthLogin: true,
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
