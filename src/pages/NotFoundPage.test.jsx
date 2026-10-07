import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("should render 404 message and link back to home", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Halaman tidak ditemukan" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Kembali ke beranda" });
    expect(link).toHaveAttribute("href", "/");
  });
});
