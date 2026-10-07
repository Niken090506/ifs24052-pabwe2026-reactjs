import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import SidebarComponent from "./SidebarComponent";
import { renderWithProviders } from "../../../test-utils";

describe("SidebarComponent", () => {
  it("should render navigation links properly", () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={false} onClose={onClose} />);

    expect(screen.getByText("Laporan")).toBeInTheDocument();
    expect(screen.getByText("Statistik")).toBeInTheDocument();
    expect(screen.getByText("Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("should render backdrop and call onClose when backdrop clicked on mobile", () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={true} onClose={onClose} />);

    const backdrop = screen.getByRole("button", { name: "Tutup menu navigasi" });
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose when clicking close button in mobile header", () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={true} onClose={onClose} />);

    const closeBtn = screen.getByRole("button", { name: "Tutup menu" });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onClose when clicking navigation link", () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={true} onClose={onClose} />);

    const link = screen.getByText("Pengguna");
    fireEvent.click(link);
    expect(onClose).toHaveBeenCalled();
  });
});
