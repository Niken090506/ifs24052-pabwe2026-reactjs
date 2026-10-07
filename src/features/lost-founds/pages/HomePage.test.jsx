import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../../test-utils";
import * as lostFoundAction from "../states/action";

describe("HomePage", () => {
  const mockLostFounds = [
    {
      id: 1,
      title: "Dompet Hilang",
      description: "Dompet hilang di kantin",
      status: "lost",
      is_completed: 0,
      cover: "https://example.com/cover1.jpg",
      created_at: "2024-02-26T02:34:26.000000Z",
      user: {
        id: 1,
        name: "Abdullah",
      },
    },
    {
      id: 2,
      title: "Kunci Ditemukan",
      description: "Kunci ditemukan di perpustakaan",
      status: "found",
      is_completed: 1,
      cover: null,
      created_at: "2024-02-26T02:34:26.000000Z",
      user: {
        id: 2,
        name: "Budi",
      },
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(lostFoundAction, "asyncSetLostFounds").mockReturnValue(
      () => Promise.resolve()
    );

    vi.spyOn(lostFoundAction, "asyncSetLostFoundStats").mockReturnValue(
      () => Promise.resolve()
    );
  });

  it("should render the main Lost and Found page", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    expect(
      screen.getByText("Laporan Barang Hilang & Temuan")
    ).toBeInTheDocument();

    expect(screen.getByText("Daftar laporan")).toBeInTheDocument();
    expect(screen.getByText("Statistik")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tambah laporan" })).toBeInTheDocument();
  });

  it("should dispatch initial lost found and statistics requests", async () => {
    const lostFoundsSpy = vi.spyOn(
      lostFoundAction,
      "asyncSetLostFounds"
    );

    const statsSpy = vi.spyOn(
      lostFoundAction,
      "asyncSetLostFoundStats"
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: [],
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    await waitFor(() => {
      expect(lostFoundsSpy).toHaveBeenCalledWith({});
      expect(statsSpy).toHaveBeenCalled();
    });
  });

  it("should display report metrics", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    expect(screen.getByText("Total laporan")).toBeInTheDocument();
    expect(screen.getByText("Barang hilang")).toBeInTheDocument();
    expect(screen.getByText("Barang ditemukan")).toBeInTheDocument();
    expect(screen.getAllByText("Selesai").length).toBeGreaterThan(0);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render lost found cards", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    expect(screen.getByText("Dompet Hilang")).toBeInTheDocument();
    expect(screen.getByText("Kunci Ditemukan")).toBeInTheDocument();

    expect(
      screen.getByText("Dompet hilang di kantin")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Kunci ditemukan di perpustakaan")
    ).toBeInTheDocument();

    // Check badges within the report cards
    expect(screen.getAllByText("Hilang").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ditemukan").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Selesai").length).toBeGreaterThan(0);
  });

  it("should show loading state", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: [],
        isLostFound: true,
        lostFoundStats: null,
      },
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Memuat laporan…"
    );
  });

  it("should show empty state when no report matches", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: [],
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    expect(
      screen.getByText("Belum ada laporan yang cocok dengan filter ini.")
    ).toBeInTheDocument();
  });

  it("should filter reports by keyword in title", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    const searchInput = screen.getByLabelText("Cari laporan");

    fireEvent.change(searchInput, {
      target: { value: "Dompet" },
    });

    expect(screen.getByText("Dompet Hilang")).toBeInTheDocument();
    expect(
      screen.queryByText("Kunci Ditemukan")
    ).not.toBeInTheDocument();
  });

  it("should filter reports by keyword in description", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    const searchInput = screen.getByLabelText("Cari laporan");

    fireEvent.change(searchInput, {
      target: { value: "perpustakaan" },
    });

    expect(screen.getByText("Kunci Ditemukan")).toBeInTheDocument();
    expect(
      screen.queryByText("Dompet Hilang")
    ).not.toBeInTheDocument();
  });

  it("should handle null title and description during search", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: [
          {
            id: 3,
            title: null,
            description: null,
            status: "lost",
            is_completed: 0,
          },
        ],
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    const searchInput = screen.getByLabelText("Cari laporan");

    fireEvent.change(searchInput, {
      target: { value: "tidak ditemukan" },
    });

    expect(
      screen.getByText("Belum ada laporan yang cocok dengan filter ini.")
    ).toBeInTheDocument();
  });

  it("should filter reports by lost status", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Hilang" }));

    expect(screen.getByText("Dompet Hilang")).toBeInTheDocument();
    expect(
      screen.queryByText("Kunci Ditemukan")
    ).not.toBeInTheDocument();
  });

  it("should filter reports by found status", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Ditemukan" }));

    expect(screen.getByText("Kunci Ditemukan")).toBeInTheDocument();
    expect(
      screen.queryByText("Dompet Hilang")
    ).not.toBeInTheDocument();
  });

  it("should filter completed reports", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.change(screen.getByLabelText("Status penyelesaian"), {
      target: { value: "done" },
    });

    expect(screen.getByText("Kunci Ditemukan")).toBeInTheDocument();
    expect(
      screen.queryByText("Dompet Hilang")
    ).not.toBeInTheDocument();
  });

  it("should filter unfinished reports", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.change(screen.getByLabelText("Status penyelesaian"), {
      target: { value: "open" },
    });

    expect(screen.getByText("Dompet Hilang")).toBeInTheDocument();
    expect(
      screen.queryByText("Kunci Ditemukan")
    ).not.toBeInTheDocument();
  });

  it("should reload reports when only mine filter changes", async () => {
    const spy = vi.spyOn(
      lostFoundAction,
      "asyncSetLostFounds"
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.click(screen.getByLabelText("Laporan saya saja"));

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ is_me: 1 });
    });
  });

  it("should open and close AddModal", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Tambah laporan" })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tambah laporan" })).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Tutup dialog" })
    );

    expect(
      screen.queryByRole("dialog")
    ).not.toBeInTheDocument();
  });

  it("should render statistics data", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: {
          daily: [
            {
              date: "2026-10-01",
              total: 5,
            },
          ],
          monthly: [
            {
              month: "2026-10",
              total: 10,
            },
          ],
        },
      },
    });

    expect(screen.getByText("Statistik harian")).toBeInTheDocument();
    expect(screen.getByText("Statistik bulanan")).toBeInTheDocument();
  });

  it("should scroll to statistics when hash is #statistik", () => {
    const scrollSpy = vi.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    renderWithProviders(<HomePage />, {
      route: "/#statistik",
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    expect(scrollSpy).toHaveBeenCalled();
  });

  it("should trigger refresh when AddModal submits successfully", async () => {
    vi.spyOn(lostFoundAction, "asyncAddLostFound").mockReturnValue(() => Promise.resolve(true));
    const setLostFoundsSpy = vi.spyOn(lostFoundAction, "asyncSetLostFounds");
    const setStatsSpy = vi.spyOn(lostFoundAction, "asyncSetLostFoundStats");

    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Tambah laporan" }));
    fireEvent.change(screen.getByLabelText("Judul laporan"), { target: { value: "Buku Baru" } });
    fireEvent.change(screen.getByLabelText("Deskripsi"), { target: { value: "Buku tertinggal di kelas" } });
    fireEvent.submit(screen.getByRole("button", { name: "Simpan laporan" }).closest("form"));

    await waitFor(() => {
      expect(setStatsSpy).toHaveBeenCalled();
      expect(setLostFoundsSpy).toHaveBeenCalled();
    });
  });

  it("should trigger refresh with onlyMine filter when AddModal submits successfully and onlyMine is checked", async () => {
    vi.spyOn(lostFoundAction, "asyncAddLostFound").mockReturnValue(() => Promise.resolve(true));
    const setLostFoundsSpy = vi.spyOn(lostFoundAction, "asyncSetLostFounds");

    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: mockLostFounds,
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    fireEvent.click(screen.getByLabelText("Laporan saya saja"));
    setLostFoundsSpy.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Tambah laporan" }));
    fireEvent.change(screen.getByLabelText("Judul laporan"), { target: { value: "Buku Saya" } });
    fireEvent.change(screen.getByLabelText("Deskripsi"), { target: { value: "Buku tertinggal" } });
    fireEvent.submit(screen.getByRole("button", { name: "Simpan laporan" }).closest("form"));

    await waitFor(() => {
      expect(setLostFoundsSpy).toHaveBeenCalledWith({ is_me: 1 });
    });
  });

  it("should render fallback status label when item has unknown status", () => {
    const unknownItem = {
      id: 99,
      title: "Barang Lain",
      description: "Deskripsi",
      status: "custom_status",
      is_completed: 0,
      user: { name: "Ubaid" },
    };

    renderWithProviders(<HomePage />, {
      preloadedState: {
        lostFounds: [unknownItem],
        isLostFound: false,
        lostFoundStats: null,
      },
    });

    expect(screen.getByText("custom_status")).toBeInTheDocument();
  });
});