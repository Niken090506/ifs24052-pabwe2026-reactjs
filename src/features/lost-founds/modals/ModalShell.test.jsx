import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalShell from "./ModalShell";

describe("ModalShell", () => {
  it("should render title and content, and handle backdrop click", () => {
    const onClose = vi.fn();
    render(
      <ModalShell titleId="test-modal" title="Judul Modal" onClose={onClose}>
        <input data-testid="modal-input" />
      </ModalShell>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Judul Modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-input")).toHaveFocus();

    fireEvent.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should handle close button click", () => {
    const onClose = vi.fn();
    render(
      <ModalShell titleId="test-modal" title="Judul Modal" onClose={onClose}>
        <p>Konten</p>
      </ModalShell>
    );

    fireEvent.click(screen.getByLabelText("Tutup dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should close on Escape key", () => {
    const onClose = vi.fn();
    render(
      <ModalShell titleId="test-modal" title="Judul Modal" onClose={onClose}>
        <input />
      </ModalShell>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should trap focus with Tab and Shift+Tab", () => {
    const onClose = vi.fn();
    render(
      <ModalShell titleId="test-modal" title="Judul Modal" onClose={onClose}>
        <input data-testid="first-input" />
        <button data-testid="second-button">Tombol</button>
      </ModalShell>
    );

    const closeBtn = screen.getByLabelText("Tutup dialog");
    const firstInput = screen.getByTestId("first-input");
    const secondButton = screen.getByTestId("second-button");

    // Press a key other than Tab or Escape
    fireEvent.keyDown(document, { key: "Enter" });

    // Focus first focusable item (close button) and press Shift+Tab
    closeBtn.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(secondButton).toHaveFocus();

    // Focus last focusable item and press Tab
    secondButton.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false });
    expect(closeBtn).toHaveFocus();

    // Tab on non-last element and Shift+Tab on non-first element
    firstInput.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false });
    secondButton.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  });

  it("should focus dialog element itself if no form controls exist and restore previous focus on unmount", () => {
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.focus();

    const { unmount } = render(
      <ModalShell titleId="test-modal" title="Judul Modal" onClose={() => {}}>
        <div>Tidak ada kontrol formulir</div>
      </ModalShell>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    unmount();
    expect(button).toHaveFocus();
    document.body.removeChild(button);
  });
});
