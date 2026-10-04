import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as todoAction from "../states/action";

describe("ChangeCoverModal", () => {
  const mockTodo = { id: 1, title: "Todo Test" };

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
  });

  it("should not render when show is false", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal show={false} onClose={vi.fn()} todo={mockTodo} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should validate file presence, file type, and file size", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<ChangeCoverModal show={true} onClose={vi.fn()} todo={mockTodo} />);

    const fileInput = screen.getByTestId("cover-file-input");
    const form = fileInput.closest("form");

    fireEvent.submit(form);
    expect(errorSpy).toHaveBeenCalledWith("Pilih file cover terlebih dahulu!");

    // Empty files test
    fireEvent.change(fileInput, { target: { files: [] } });

    // Non-image file test
    const badFile = new File(["dummy"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    expect(errorSpy).toHaveBeenCalledWith("Hanya file JPEG, JPG, atau PNG yang diperbolehkan!");

    // Large file test (>1MB)
    const largeFile = new File([new Uint8Array(2 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(errorSpy).toHaveBeenCalledWith("Ukuran file terlalu besar. Maksimal 1MB!");
  });

  it("should preview selected image and dispatch cover upload on valid file", () => {
    const changeCoverSpy = vi
      .spyOn(todoAction, "asyncSetIsTodoChangeCover")
      .mockReturnValue(() => {});
    const onClose = vi.fn();

    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} todo={mockTodo} />,
      {
        preloadedState: {
          isTodoChangeCover: false,
          isTodoChangedCover: false,
        },
      }
    );

    const fileInput = screen.getByTestId("cover-file-input");
    const validFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByAltText("Preview")).toBeInTheDocument();

    const form = fileInput.closest("form");
    fireEvent.submit(form);

    expect(changeCoverSpy).toHaveBeenCalledWith(1, validFile);

    // Simulate completion
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} todo={mockTodo} />,
      {
        preloadedState: {
          isTodoChangeCover: true,
          isTodoChangedCover: true,
        },
      }
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("should handle isTodoChangeCover true when isTodoChangedCover is false", () => {
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={vi.fn()} todo={mockTodo} />,
      {
        preloadedState: {
          isTodoChangeCover: true,
          isTodoChangedCover: false,
        },
      }
    );

    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();
  });

  it("should trigger onClose when close or cancel button clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} todo={mockTodo} />
    );

    fireEvent.click(screen.getByTestId("close-cover-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("cancel-cover-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
