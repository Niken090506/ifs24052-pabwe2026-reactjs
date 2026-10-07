import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as lostFoundAction from "../states/action";

describe("ChangeCoverModal", () => {
  const mockLostFound = {
    id: 1,
    title: "Dompet Hilang",
    cover: "https://example.com/cover.jpg",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  it("should render the modal with current cover", () => {
    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Ubah gambar cover")).toBeInTheDocument();
    expect(screen.getByAltText("Cover saat ini untuk Dompet Hilang")).toBeInTheDocument();
  });

  it("should validate file presence", async () => {
    const warningSpy = vi
      .spyOn(toolsHelper, "showWarningDialog")
      .mockResolvedValue(undefined);

    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    fireEvent.submit(fileInput.closest("form"));

    await waitFor(() => {
      expect(warningSpy).toHaveBeenCalledWith("Pilih gambar terlebih dahulu.");
    });
  });

  it("should reject non-image files", async () => {
    const warningSpy = vi
      .spyOn(toolsHelper, "showWarningDialog")
      .mockResolvedValue(undefined);

    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const invalidFile = new File(["dummy"], "document.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, {
      target: { files: [invalidFile] },
    });

    await waitFor(() => {
      expect(warningSpy).toHaveBeenCalledWith("Berkas harus berupa gambar.");
    });
  });

  it("should reject files larger than 2 MB", async () => {
    const warningSpy = vi
      .spyOn(toolsHelper, "showWarningDialog")
      .mockResolvedValue(undefined);

    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const largeFile = new File(
      [new Uint8Array(2 * 1024 * 1024 + 1)],
      "large.png",
      { type: "image/png" }
    );

    fireEvent.change(fileInput, {
      target: { files: [largeFile] },
    });

    await waitFor(() => {
      expect(warningSpy).toHaveBeenCalledWith(
        "Ukuran gambar maksimal 2 MB."
      );
    });
  });

  it("should preview a valid image", async () => {
    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const validFile = new File(["dummy"], "photo.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, {
      target: { files: [validFile] },
    });

    await waitFor(() => {
      expect(
        screen.getByAltText("Pratinjau gambar yang dipilih")
      ).toBeInTheDocument();
    });

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(validFile);
  });

  it("should dispatch cover upload and close after success", async () => {
    const changeCoverSpy = vi
      .spyOn(lostFoundAction, "asyncChangeLostFoundCover")
      .mockReturnValue(() => Promise.resolve(true));

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const validFile = new File(["dummy"], "photo.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, {
      target: { files: [validFile] },
    });

    fireEvent.submit(fileInput.closest("form"));

    await waitFor(() => {
      expect(changeCoverSpy).toHaveBeenCalledWith(1, validFile);
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should not close when upload fails", async () => {
    vi.spyOn(lostFoundAction, "asyncChangeLostFoundCover").mockReturnValue(
      () => Promise.resolve(false)
    );

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const validFile = new File(["dummy"], "photo.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, {
      target: { files: [validFile] },
    });

    fireEvent.submit(fileInput.closest("form"));

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  it("should disable submit button while uploading", () => {
    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
      {
        preloadedState: {
          isLostFoundChangeCover: true,
        },
      }
    );

    expect(screen.getByRole("button", { name: "Mengunggah…" })).toBeDisabled();
  });

  it("should close when cancel or close button is clicked", () => {
    const onClose = vi.fn();

    renderWithProviders(
      <ChangeCoverModal
        lostFound={mockLostFound}
        onClose={onClose}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Tutup dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should reset file when input file selection is cleared", () => {
    renderWithProviders(
      <ChangeCoverModal
        lostFound={{ id: 2, title: "Kunci" }}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    fireEvent.change(fileInput, {
      target: { files: [] },
    });
    expect(screen.queryByAltText("Pratinjau gambar yang dipilih")).not.toBeInTheDocument();
  });
});