import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import NavbarComponent from "./NavbarComponent";
import { renderWithProviders } from "../../../test-utils";

describe("NavbarComponent", () => {
  const mockProfileWithPhoto = {
    name: "Abdullah",
    email: "abdullah@delcom.org",
    photo: "https://example.com/photo.jpg",
  };

  const mockProfileWithoutPhoto = {
    name: "Ubaid",
    email: null,
    photo: null,
  };

  const mockProfileEmpty = {
    name: "",
    email: "",
    photo: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render profile photo and name correctly", () => {
    const onLogout = vi.fn();
    const onToggleSidebar = vi.fn();

    renderWithProviders(
      <NavbarComponent
        profile={mockProfileWithPhoto}
        onLogout={onLogout}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
      />
    );

    expect(screen.getByText("Abdullah")).toBeInTheDocument();
    expect(screen.getByText("Lost & Founds")).toBeInTheDocument();
  });

  it("should render avatar initial fallback when photo is null and show fallback name in dropdown", () => {
    renderWithProviders(
      <NavbarComponent
        profile={mockProfileWithoutPhoto}
        onLogout={vi.fn()}
        onToggleSidebar={vi.fn()}
        isSidebarOpen={true}
      />
    );

    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buka menu navigasi" })).toHaveAttribute("aria-expanded", "true");

    const dropdownBtn = screen.getByRole("button", { name: /Ubaid/ });
    fireEvent.click(dropdownBtn);
    expect(screen.getAllByText("Ubaid").length).toBeGreaterThan(0);
  });

  it("should render default Pengguna fallback when name and email are empty or null", () => {
    const { rerender } = renderWithProviders(
      <NavbarComponent
        profile={mockProfileEmpty}
        onLogout={vi.fn()}
        onToggleSidebar={vi.fn()}
        isSidebarOpen={false}
      />
    );

    expect(screen.getByText("Pengguna")).toBeInTheDocument();

    rerender(
      <NavbarComponent
        profile={null}
        onLogout={vi.fn()}
        onToggleSidebar={vi.fn()}
        isSidebarOpen={false}
      />
    );
    const dropdownBtn = screen.getByRole("button", { name: /Pengguna/ });
    fireEvent.click(dropdownBtn);
    expect(screen.getAllByText("Pengguna").length).toBeGreaterThan(0);
  });

  it("should toggle sidebar on mobile menu button click", () => {
    const onToggleSidebar = vi.fn();
    renderWithProviders(
      <NavbarComponent
        profile={mockProfileWithPhoto}
        onLogout={vi.fn()}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: "Buka menu navigasi" });
    fireEvent.click(toggleBtn);
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it("should open and close profile dropdown menu, navigate to profile and call onLogout", () => {
    const onLogout = vi.fn();
    renderWithProviders(
      <NavbarComponent
        profile={mockProfileWithPhoto}
        onLogout={onLogout}
        onToggleSidebar={vi.fn()}
        isSidebarOpen={false}
      />
    );

    const dropdownBtn = screen.getByRole("button", { name: /Abdullah/ });
    fireEvent.click(dropdownBtn);

    expect(screen.getByText("Profil saya")).toBeInTheDocument();
    expect(screen.getByText("abdullah@delcom.org")).toBeInTheDocument();

    // Click profile link to close dropdown
    const profileLink = screen.getByText("Profil saya");
    fireEvent.click(profileLink);
    expect(screen.queryByText("Profil saya")).not.toBeInTheDocument();

    // Open again to click logout
    fireEvent.click(dropdownBtn);
    const logoutBtn = screen.getByRole("button", { name: "Keluar" });
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });

  it("should close dropdown on outside click or Escape, but stay open on inside click or other keys", () => {
    renderWithProviders(
      <NavbarComponent
        profile={mockProfileWithPhoto}
        onLogout={vi.fn()}
        onToggleSidebar={vi.fn()}
        isSidebarOpen={false}
      />
    );

    const dropdownBtn = screen.getByRole("button", { name: /Abdullah/ });
    fireEvent.click(dropdownBtn);
    const dropdownMenu = screen.getByText("Masuk sebagai");
    expect(dropdownMenu).toBeInTheDocument();

    // Clicking inside the wrapper
    fireEvent.mouseDown(dropdownMenu);
    expect(screen.getByText("Masuk sebagai")).toBeInTheDocument();

    // Pressing another key like Enter
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.getByText("Masuk sebagai")).toBeInTheDocument();

    // Simulate clicking outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Masuk sebagai")).not.toBeInTheDocument();

    // Simulate Escape key
    fireEvent.click(dropdownBtn);
    expect(screen.getByText("Masuk sebagai")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Masuk sebagai")).not.toBeInTheDocument();
  });
});
