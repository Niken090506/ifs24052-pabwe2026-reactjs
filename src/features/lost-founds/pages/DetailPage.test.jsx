import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as lostFoundAction from "../states/action";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});

describe("DetailPage", () => {
  const mockProfile = { id: 10, name: "Niken", email: "niken@del.ac.id" };
  const mockLostFound = {
    id: 1,
    title: "Laptop Hilang",
    description: "Laptop ASUS tertinggal di lab",
    status: "lost",
    is_completed: 0,
    cover: "https://example.com/cover.jpg",
    created_at: "2026-10-01T08:00:00.000000Z",
    user_id: 10,
    user: {
      id: 10,
      name: "Niken",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state when loading and item not yet loaded", () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: null,
        isLostFound: true,
      },
    });

    expect(screen.getByRole("status")).toHaveTextContent("Memuat detail laporan…");
  });

  it("should show not found state when not loading and lostFound is null", () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: null,
        isLostFound: false,
      },
    });

    expect(screen.getByText("Laporan tidak ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Kembali ke daftar laporan")).toBeInTheDocument();
  });

  it("should render lost found details and allow opening/closing cover & change modals", () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFound,
        isLostFound: false,
      },
    });

    expect(screen.getByText("Laptop Hilang")).toBeInTheDocument();
    expect(screen.getByText("Laptop ASUS tertinggal di lab")).toBeInTheDocument();
    expect(screen.getByText("Hilang")).toBeInTheDocument();
    expect(screen.getByText("Belum selesai")).toBeInTheDocument();
    expect(screen.getByText("Niken")).toBeInTheDocument();

    // Open & close cover modal
    const editCoverBtn = screen.getByRole("button", { name: "Ubah cover" });
    fireEvent.click(editCoverBtn);
    expect(screen.getByText("Ubah gambar cover")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tutup dialog" }));
    expect(screen.queryByText("Ubah gambar cover")).not.toBeInTheDocument();

    // Open & close change modal
    const editReportBtn = screen.getByRole("button", { name: "Ubah laporan" });
    fireEvent.click(editReportBtn);
    expect(screen.getByRole("heading", { name: "Ubah laporan" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tutup dialog" }));
    expect(screen.queryByRole("heading", { name: "Ubah laporan" })).not.toBeInTheDocument();
  });

  it("should render without cover and with completed badge", () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: {
          ...mockLostFound,
          cover: null,
          is_completed: 1,
          status: "found",
        },
        isLostFound: false,
      },
    });

    expect(screen.getByText("Tanpa gambar")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();
    expect(screen.getByText("Ditemukan")).toBeInTheDocument();
  });

  it("should hide owner buttons when current user is not the owner", () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: { id: 99, name: "Other" },
        lostFound: mockLostFound,
        isLostFound: false,
      },
    });

    expect(screen.queryByRole("button", { name: "Ubah cover" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ubah laporan" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hapus laporan" })).not.toBeInTheDocument();
  });

  it("should trigger confirm dialog and dispatch delete when confirmed", async () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());
    const deleteSpy = vi
      .spyOn(lostFoundAction, "asyncDeleteLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFound,
        isLostFound: false,
      },
    });

    const deleteBtn = screen.getByRole("button", { name: "Hapus laporan" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("1");
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("should not dispatch delete when cancelled in dialog", async () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());
    const deleteSpy = vi
      .spyOn(lostFoundAction, "asyncDeleteLostFound")
      .mockReturnValue(() => Promise.resolve(true));

    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(false);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFound,
        isLostFound: false,
      },
    });

    const deleteBtn = screen.getByRole("button", { name: "Hapus laporan" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toolsHelper.showConfirmDialog).toHaveBeenCalled();
    });
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should trigger reload when modal successfully updates", async () => {
    const setLostFoundSpy = vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());
    vi.spyOn(lostFoundAction, "asyncChangeLostFoundCover").mockReturnValue(() => Promise.resolve(true));

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFound,
        isLostFound: false,
      },
    });

    // Reset spy call count from initial mount
    setLostFoundSpy.mockClear();

    // Open cover modal
    fireEvent.click(screen.getByRole("button", { name: "Ubah cover" }));
    const fileInput = screen.getByLabelText("Pilih gambar");
    const validFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    fireEvent.submit(fileInput.closest("form"));

    await waitFor(() => {
      expect(setLostFoundSpy).toHaveBeenCalledWith("1");
    });
  });

  it("should not navigate when delete action returns false", async () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());
    vi.spyOn(lostFoundAction, "asyncDeleteLostFound").mockReturnValue(() => Promise.resolve(false));
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);

    mockNavigate.mockClear();

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: mockLostFound,
        isLostFound: false,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Hapus laporan" }));
    await waitFor(() => {
      expect(lostFoundAction.asyncDeleteLostFound).toHaveBeenCalled();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should render fallback status label when status is unknown", () => {
    vi.spyOn(lostFoundAction, "asyncSetLostFound").mockReturnValue(() => Promise.resolve());

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        lostFound: {
          ...mockLostFound,
          status: "archived",
        },
        isLostFound: false,
      },
    });

    expect(screen.getByText("archived")).toBeInTheDocument();
  });
});
