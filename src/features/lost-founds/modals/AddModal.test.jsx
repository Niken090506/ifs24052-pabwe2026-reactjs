import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";
import * as lostFoundAction from "../states/action";

describe("AddModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the modal with default values", () => {
    renderWithProviders(<AddModal onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tambah laporan" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul laporan")).toHaveValue("");
    expect(screen.getByLabelText("Deskripsi")).toHaveValue("");
    expect(screen.getByRole("radio", { name: "Barang hilang" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Barang ditemukan" })).not.toBeChecked();
  });

  it("should update form fields when user types or changes radio", () => {
    renderWithProviders(<AddModal onClose={vi.fn()} onSuccess={vi.fn()} />);

    const titleInput = screen.getByLabelText("Judul laporan");
    const descInput = screen.getByLabelText("Deskripsi");
    const foundRadio = screen.getByRole("radio", { name: "Barang ditemukan" });

    fireEvent.change(titleInput, { target: { value: "Kunci Motor" } });
    fireEvent.change(descInput, { target: { value: "Jatuh di dekat parkiran" } });
    fireEvent.click(foundRadio);

    expect(titleInput).toHaveValue("Kunci Motor");
    expect(descInput).toHaveValue("Jatuh di dekat parkiran");
    expect(foundRadio).toBeChecked();
  });

  it("should validate empty title and description on submit", () => {
    renderWithProviders(<AddModal onClose={vi.fn()} onSuccess={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: "Simpan laporan" });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Judul wajib diisi.")).toBeInTheDocument();

    const titleInput = screen.getByLabelText("Judul laporan");
    fireEvent.change(titleInput, { target: { value: "Judul Valid" } });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Deskripsi wajib diisi.")).toBeInTheDocument();
  });

  it("should dispatch asyncAddLostFound, call onSuccess and onClose on successful add", async () => {
    const addSpy = vi
      .spyOn(lostFoundAction, "asyncAddLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(<AddModal onClose={onClose} onSuccess={onSuccess} />);

    const titleInput = screen.getByLabelText("Judul laporan");
    const descInput = screen.getByLabelText("Deskripsi");

    fireEvent.change(titleInput, { target: { value: "Jaket Hitam" } });
    fireEvent.change(descInput, { target: { value: "Ditemukan di kantin" } });

    const submitBtn = screen.getByRole("button", { name: "Simpan laporan" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(addSpy).toHaveBeenCalledWith("Jaket Hitam", "Ditemukan di kantin", "lost");
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should not call onSuccess or onClose when asyncAddLostFound returns false", async () => {
    vi.spyOn(lostFoundAction, "asyncAddLostFound").mockReturnValue(
      () => Promise.resolve(false)
    );

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(<AddModal onClose={onClose} onSuccess={onSuccess} />);

    const titleInput = screen.getByLabelText("Judul laporan");
    const descInput = screen.getByLabelText("Deskripsi");

    fireEvent.change(titleInput, { target: { value: "Jaket Hitam" } });
    fireEvent.change(descInput, { target: { value: "Ditemukan di kantin" } });

    const submitBtn = screen.getByRole("button", { name: "Simpan laporan" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("should disable submit button when isLostFoundAdd is true", () => {
    renderWithProviders(<AddModal onClose={vi.fn()} onSuccess={vi.fn()} />, {
      preloadedState: {
        isLostFoundAdd: true,
      },
    });

    expect(screen.getByRole("button", { name: "Menyimpan…" })).toBeDisabled();
  });

  it("should call onClose when close or cancel button is clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} onSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Tutup dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
