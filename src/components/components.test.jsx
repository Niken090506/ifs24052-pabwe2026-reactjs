import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";
import FormField from "./FormField";
import RouteFallback from "./RouteFallback";

describe("RouteFallback", () => {
  it("should render fallback text", () => {
    render(<RouteFallback />);
    expect(screen.getByRole("status")).toHaveTextContent("Memuat halaman…");
  });
});

describe("Avatar", () => {
  it("should render image if photo is provided", () => {
    const { container } = render(
      <Avatar name="John Doe" photo="https://example.com/avatar.jpg" size="sm" className="custom-class" />
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("width", "32");
    expect(img).toHaveClass("custom-class");
  });

  it("should render initials when photo is not provided", () => {
    render(<Avatar name="John Doe" size="lg" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should handle default size md and fallback initials for single or empty names", () => {
    const { rerender } = render(<Avatar name="" />);
    expect(screen.getByText("?")).toBeInTheDocument();

    rerender(<Avatar name="   " />);
    expect(screen.getByText("?")).toBeInTheDocument();

    rerender(<Avatar name={null} />);
    expect(screen.getByText("?")).toBeInTheDocument();

    rerender(<Avatar name="Alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

describe("FormField", () => {
  it("should render label, input, hint, and error properly", () => {
    render(
      <FormField
        id="email"
        label="Alamat Email"
        hint="Gunakan email kampus"
        error="Email tidak valid"
        defaultValue="test"
      />
    );
    expect(screen.getByLabelText("Alamat Email")).toBeInTheDocument();
    expect(screen.getByText("Gunakan email kampus")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Email tidak valid");
    const input = screen.getByLabelText("Alamat Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error email-hint");
  });

  it("should render custom component like textarea without hint or error", () => {
    render(
      <FormField
        as="textarea"
        id="deskripsi"
        label="Deskripsi"
        placeholder="Tulis deskripsi"
      />
    );
    const textarea = screen.getByPlaceholderText("Tulis deskripsi");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).not.toHaveAttribute("aria-invalid");
    expect(textarea).not.toHaveAttribute("aria-describedby");
  });
});
