import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as userAction from "../states/action";

describe("ProfilePage", () => {
  const mockProfile = {
    id: 1,
    name: "Abdullah Ubaid",
    email: "ifs18005@del.ac.id",
    photo: "https://example.com/photo.jpg",
  };

  const mockProfileEmptyName = {
    id: 3,
    name: "",
    email: "",
    photo: null,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("should display profile information and initial avatar fallback", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: {
          id: 2,
          name: "Budi",
          email: "budi@del.ac.id",
          photo: null,
        },
      },
    });

    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama lengkap")).toHaveValue("Budi");
    expect(screen.getByLabelText("Email")).toHaveValue("budi@del.ac.id");
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("should handle profile with empty name and email using fallback avatar initial", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: mockProfileEmptyName,
      },
    });

    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("should validate and submit update profile", async () => {
    const changeSpy = vi
      .spyOn(userAction, "asyncChangeProfile")
      .mockReturnValue(() => Promise.resolve(true));

    renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const nameInput = screen.getByLabelText("Nama lengkap");
    const emailInput = screen.getByLabelText("Email");
    const submitBtn = screen.getByRole("button", { name: "Simpan perubahan" });

    // Empty name
    fireEvent.change(nameInput, { target: { value: "   " } });
    fireEvent.click(submitBtn);
    expect(screen.getByText("Nama wajib diisi.")).toBeInTheDocument();

    // Invalid email
    fireEvent.change(nameInput, { target: { value: "Abdullah Baru" } });
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitBtn);
    expect(screen.getByText("Format email tidak valid.")).toBeInTheDocument();

    // Valid
    fireEvent.change(emailInput, { target: { value: "baru@del.ac.id" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(changeSpy).toHaveBeenCalledWith("Abdullah Baru", "baru@del.ac.id");
    });
  });

  it("should validate and upload photo", async () => {
    const warningSpy = vi
      .spyOn(toolsHelper, "showWarningDialog")
      .mockResolvedValue(undefined);
    const photoSpy = vi
      .spyOn(userAction, "asyncChangeProfilePhoto")
      .mockReturnValue(() => Promise.resolve(true));

    renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const fileInput = screen.getByLabelText("Pilih foto baru");
    const uploadBtn = screen.getByRole("button", { name: "Unggah foto" });

    // Submit without selecting a photo
    fireEvent.click(uploadBtn);
    expect(warningSpy).toHaveBeenCalledWith("Pilih foto terlebih dahulu.");

    // Empty change event
    fireEvent.change(fileInput, { target: { files: [] } });

    // Invalid file type
    const textFile = new File(["dummy"], "file.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [textFile] } });
    expect(warningSpy).toHaveBeenCalledWith("Berkas harus berupa gambar.");

    // Large file (>2MB)
    const largeFile = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "large.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(warningSpy).toHaveBeenCalledWith("Ukuran foto maksimal 2 MB.");

    // Valid file
    const validFile = new File(["img"], "profile.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    fireEvent.click(uploadBtn);

    await waitFor(() => {
      expect(photoSpy).toHaveBeenCalledWith(validFile);
    });
  });

  it("should validate and submit password update", async () => {
    const changePasswordSpy = vi
      .spyOn(userAction, "asyncChangeProfilePassword")
      .mockReturnValue(() => Promise.resolve(true));

    renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    const oldPassInput = screen.getByLabelText("Kata sandi saat ini");
    const newPassInput = screen.getByLabelText("Kata sandi baru");
    const confirmPassInput = screen.getByLabelText("Konfirmasi kata sandi baru");
    const submitBtn = screen.getByRole("button", { name: "Ubah kata sandi" });

    // Empty old password
    fireEvent.click(submitBtn);
    expect(screen.getByText("Kata sandi saat ini wajib diisi.")).toBeInTheDocument();

    // Short new password (<6)
    fireEvent.change(oldPassInput, { target: { value: "old123" } });
    fireEvent.change(newPassInput, { target: { value: "123" } });
    fireEvent.click(submitBtn);
    expect(screen.getByText("Kata sandi baru minimal 6 karakter.")).toBeInTheDocument();

    // Confirmation mismatch
    fireEvent.change(newPassInput, { target: { value: "password123" } });
    fireEvent.change(confirmPassInput, { target: { value: "mismatch123" } });
    fireEvent.click(submitBtn);
    expect(screen.getByText("Konfirmasi kata sandi tidak sama.")).toBeInTheDocument();

    // Valid
    fireEvent.change(confirmPassInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(changePasswordSpy).toHaveBeenCalledWith("old123", "password123");
    });
  });

  it("should handle status flags from store", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: mockProfile,
        isChangeProfile: true,
        isChangeProfilePhoto: true,
        isChangeProfilePassword: true,
      },
    });

    const savingButtons = screen.getAllByRole("button", { name: "Menyimpan…" });
    expect(savingButtons.length).toBe(2);
    savingButtons.forEach((btn) => expect(btn).toBeDisabled());
    expect(screen.getByRole("button", { name: "Mengunggah…" })).toBeDisabled();
  });

  it("should handle profile being null or undefined", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        profile: null,
      },
    });

    expect(screen.getByLabelText("Nama lengkap")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
  });

  it("should handle failed photo and password change", async () => {
    vi.spyOn(userAction, "asyncChangeProfilePhoto").mockReturnValue(() => Promise.resolve(false));
    vi.spyOn(userAction, "asyncChangeProfilePassword").mockReturnValue(() => Promise.resolve(false));

    renderWithProviders(<ProfilePage />, {
      preloadedState: { profile: mockProfile },
    });

    // Failed photo
    const fileInput = screen.getByLabelText("Pilih foto baru");
    const validFile = new File(["img"], "profile.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    fireEvent.click(screen.getByRole("button", { name: "Unggah foto" }));

    // Failed password
    const oldPassInput = screen.getByLabelText("Kata sandi saat ini");
    const newPassInput = screen.getByLabelText("Kata sandi baru");
    const confirmPassInput = screen.getByLabelText("Konfirmasi kata sandi baru");
    fireEvent.change(oldPassInput, { target: { value: "old123" } });
    fireEvent.change(newPassInput, { target: { value: "password123" } });
    fireEvent.change(confirmPassInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Ubah kata sandi" }));

    await waitFor(() => {
      expect(oldPassInput).toHaveValue("old123");
    });
  });
});
