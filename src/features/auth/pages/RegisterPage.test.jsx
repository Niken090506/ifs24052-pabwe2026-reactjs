import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import RegisterPage, { validateRegister } from "./RegisterPage";
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

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateRegister helper", () => {
    it("should validate empty fields", () => {
      const errors = validateRegister("", "", "", "");
      expect(errors.name).toBe("Nama wajib diisi.");
      expect(errors.email).toBe("Email wajib diisi.");
      expect(errors.password).toBe("Kata sandi minimal 6 karakter.");
    });

    it("should validate invalid email and password length", () => {
      const errors = validateRegister("User", "invalid-email", "123", "123");
      expect(errors.email).toBe("Format email tidak valid.");
      expect(errors.password).toBe("Kata sandi minimal 6 karakter.");
    });

    it("should validate password mismatch", () => {
      const errors = validateRegister("User", "user@delcom.org", "123456", "different");
      expect(errors.confirmPassword).toBe("Konfirmasi kata sandi tidak sama.");
    });

    it("should return empty errors for valid input", () => {
      const errors = validateRegister("User", "user@delcom.org", "123456", "123456");
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  it("should render inputs and dispatch registration", async () => {
    const registerSpy = vi
      .spyOn(authAction, "asyncSetIsAuthRegister")
      .mockReturnValue(() => Promise.resolve());

    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        isAuthRegister: false,
      },
    });

    const nameInput = screen.getByLabelText("Nama lengkap");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Kata sandi");
    const confirmInput = screen.getByLabelText("Konfirmasi kata sandi");
    const submitBtn = screen.getByRole("button", { name: "Daftar" });

    fireEvent.change(nameInput, { target: { value: "Delcom User" } });
    fireEvent.change(emailInput, { target: { value: "user@delcom.org" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(registerSpy).toHaveBeenCalledWith(
      "Delcom User",
      "user@delcom.org",
      "password123"
    );
  });

  it("should not dispatch registration if validation fails", async () => {
    const registerSpy = vi
      .spyOn(authAction, "asyncSetIsAuthRegister")
      .mockReturnValue(() => Promise.resolve());

    renderWithProviders(<RegisterPage />);

    const submitBtn = screen.getByRole("button", { name: "Daftar" });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(registerSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Nama wajib diisi.")).toBeInTheDocument();
  });

  it("should reset form fields and navigate to /auth/login on isAuthRegister success", () => {
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        isAuthRegister: true,
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/auth/login", { replace: true });
  });
});
