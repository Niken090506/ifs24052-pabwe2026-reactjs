import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import AuthLayout from "./AuthLayout";
import { renderWithProviders } from "../../../test-utils";
import apiHelper from "../../../helpers/apiHelper";

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render branding and layout content when user is not logged in", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<AuthLayout />);

    expect(screen.getByText("Lost & Founds")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Temukan kembali barangmu, bantu orang lain menemukan miliknya."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Praktikum PABWE 2026")).toBeInTheDocument();
  });

  it("should redirect to / when access token exists", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    renderWithProviders(<AuthLayout />);

    // Since Navigate to="/" replace is returned, the layout content is not rendered
    expect(screen.queryByText("Lost & Founds")).not.toBeInTheDocument();
  });
});
