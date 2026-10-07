import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import {
  showErrorDialog,
  showWarningDialog,
  showSuccessDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call Swal.fire for showErrorDialog", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showErrorDialog("Error test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Terjadi Kesalahan",
        text: "Error test",
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#b91c1c",
      })
    );
  });

  it("should call Swal.fire for showWarningDialog", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showWarningDialog("Warning test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Perhatian",
        text: "Warning test",
        icon: "warning",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#4338ca",
      })
    );
  });

  it("should call Swal.fire for showSuccessDialog", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    await showSuccessDialog("Success test");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Berhasil",
        text: "Success test",
        icon: "success",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#4338ca",
      })
    );
  });

  it("should call Swal.fire for showConfirmDialog and return result", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    const resTrue = await showConfirmDialog("Judul?", "Deskripsi?", "Ya, lanjutkan");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Judul?",
        text: "Deskripsi?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, lanjutkan",
        cancelButtonText: "Batal",
        confirmButtonColor: "#b91c1c",
        cancelButtonColor: "#475569",
      })
    );
    expect(resTrue).toBe(true);

    Swal.fire.mockResolvedValue({ isConfirmed: false });
    const resFalse = await showConfirmDialog("Judul?");
    expect(resFalse).toBe(false);
  });

  it("should format date correctly or return fallback for empty date", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("invalid-date")).toBe("-");
    const formatted = formatDate("2024-02-26T02:34:26.000000Z");
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe("string");
  });
});
