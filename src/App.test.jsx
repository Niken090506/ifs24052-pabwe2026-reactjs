import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet } from "react-router-dom";
import App from "./App";

vi.mock("./features/auth/layouts/AuthLayout", () => ({
  default: () => (
    <div data-testid="auth-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("./features/auth/pages/LoginPage", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock("./features/auth/pages/RegisterPage", () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock("./features/lost-founds/layouts/LostFoundLayout", () => ({
  default: () => (
    <div data-testid="lost-found-layout">
      <Outlet />
    </div>
  ),
}));

vi.mock("./features/lost-founds/pages/HomePage", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock("./features/lost-founds/pages/DetailPage", () => ({
  default: () => <div data-testid="detail-page">Detail Page</div>,
}));

vi.mock("./features/users/pages/UsersPage", () => ({
  default: () => <div data-testid="users-page">Users Page</div>,
}));

vi.mock("./features/users/pages/ProfilePage", () => ({
  default: () => <div data-testid="profile-page">Profile Page</div>,
}));

vi.mock("./pages/NotFoundPage", () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

describe("App", () => {
  it("should render login page on /auth/login", async () => {
    render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
  });

  it("should render register page on /auth/register", async () => {
    render(
      <MemoryRouter initialEntries={["/auth/register"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("register-page")).toBeInTheDocument();
  });

  it("should render home page on root route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
  });

  it("should render detail page on /lost-founds/:id", async () => {
    render(
      <MemoryRouter initialEntries={["/lost-founds/1"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("detail-page")).toBeInTheDocument();
  });

  it("should render users page on /users", async () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("users-page")).toBeInTheDocument();
  });

  it("should render profile page on /profile", async () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("profile-page")).toBeInTheDocument();
  });

  it("should render not found page on unknown route", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("not-found-page")).toBeInTheDocument();
  });
});
