import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";
import * as lostFoundAction from "../states/action";

describe("ChangeModal", () => {
  const mockLostFound = {
    id: 1,
    title: "Dompet Hilang",
    description: "Dompet hilang di kantin",
    status: "lost",
    is_completed: 0,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the modal with lost found data", () => {
    renderWithProviders(
      <ChangeModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dompet Hilang")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Dompet hilang di kantin")
    ).toBeInTheDocument();

    expect(screen.getByRole("radio", { name: "Barang hilang" })).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Barang ditemukan" })
    ).not.toBeChecked();
  });

  it("should populate found status correctly", () => {
    renderWithProviders(
      <ChangeModal
        lostFound={{
          ...mockLostFound,
          status: "found",
          is_completed: 1,
        }}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(
      screen.getByRole("radio", { name: "Barang ditemukan" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", {
        name: "Tandai laporan ini sudah selesai",
      })
    ).toBeChecked();
  });

  it("should update title, description, status, and completion", () => {
    renderWithProviders(
      <ChangeModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const titleInput = screen.getByLabelText("Judul laporan");
    const descriptionInput = screen.getByLabelText("Deskripsi");
    const foundRadio = screen.getByRole("radio", {
      name: "Barang ditemukan",
    });
    const completedCheckbox = screen.getByRole("checkbox", {
      name: "Tandai laporan ini sudah selesai",
    });

    fireEvent.change(titleInput, {
      target: { value: "Tas Ditemukan" },
    });

    fireEvent.change(descriptionInput, {
      target: { value: "Tas ditemukan di perpustakaan" },
    });

    fireEvent.click(foundRadio);
    fireEvent.click(completedCheckbox);

    expect(titleInput).toHaveValue("Tas Ditemukan");
    expect(descriptionInput).toHaveValue("Tas ditemukan di perpustakaan");
    expect(foundRadio).toBeChecked();
    expect(completedCheckbox).toBeChecked();
  });

  it("should validate empty title and description", () => {
    renderWithProviders(
      <ChangeModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const titleInput = screen.getByLabelText("Judul laporan");
    const descriptionInput = screen.getByLabelText("Deskripsi");
    const form = titleInput.closest("form");

    fireEvent.change(titleInput, {
      target: { value: "   " },
    });

    fireEvent.submit(form);

    expect(screen.getByText("Judul wajib diisi.")).toBeInTheDocument();

    fireEvent.change(titleInput, {
      target: { value: "Judul valid" },
    });

    fireEvent.change(descriptionInput, {
      target: { value: "   " },
    });

    fireEvent.submit(form);

    expect(screen.getByText("Deskripsi wajib diisi.")).toBeInTheDocument();
  });

  it("should dispatch change action with correct data", async () => {
    const changeSpy = vi
      .spyOn(lostFoundAction, "asyncChangeLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <ChangeModal
        lostFound={mockLostFound}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    fireEvent.submit(
      screen.getByLabelText("Judul laporan").closest("form")
    );

    await waitFor(() => {
      expect(changeSpy).toHaveBeenCalledWith(
        1,
        "Dompet Hilang",
        "Dompet hilang di kantin",
        "lost",
        false
      );
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should send completed as true when checkbox is checked", async () => {
    const changeSpy = vi
      .spyOn(lostFoundAction, "asyncChangeLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    renderWithProviders(
      <ChangeModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Tandai laporan ini sudah selesai",
      })
    );

    fireEvent.submit(
      screen.getByLabelText("Judul laporan").closest("form")
    );

    await waitFor(() => {
      expect(changeSpy).toHaveBeenCalledWith(
        1,
        "Dompet Hilang",
        "Dompet hilang di kantin",
        "lost",
        true
      );
    });
  });

  it("should not close when update fails", async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    vi.spyOn(lostFoundAction, "asyncChangeLostFound").mockReturnValue(
      () => Promise.resolve(false)
    );

    renderWithProviders(
      <ChangeModal
        lostFound={mockLostFound}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    fireEvent.submit(
      screen.getByLabelText("Judul laporan").closest("form")
    );

    await waitFor(() => {
      expect(onClose).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  it("should disable submit button while saving", () => {
    renderWithProviders(
      <ChangeModal
        lostFound={mockLostFound}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />,
      {
        preloadedState: {
          isLostFoundChange: true,
        },
      }
    );

    expect(
      screen.getByRole("button", { name: "Menyimpan…" })
    ).toBeDisabled();
  });

  it("should close when cancel or close button is clicked", () => {
    const onClose = vi.fn();

    renderWithProviders(
      <ChangeModal
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

  it("should handle empty title and description in lostFound prop", () => {
    renderWithProviders(
      <ChangeModal
        lostFound={{ id: 99 }}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    const titleInput = screen.getByLabelText("Judul laporan");
    const descInput = screen.getByLabelText("Deskripsi");
    expect(titleInput.value).toBe("");
    expect(descInput.value).toBe("");
  });
});