import { render, screen } from "@testing-library/react";
import LandingPage from "@/app/page";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>,
}));

describe("LandingPage", () => {
  it("renders the hero, onboarding steps, and footer content", () => {
    render(<LandingPage />);

    expect(screen.getByRole("heading", { name: /Trade knowledge/i })).toBeInTheDocument();
    expect(screen.getByText("Teach")).toBeInTheDocument();
    expect(screen.getByText("Earn")).toBeInTheDocument();
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("SkillSwap — Teach. Earn. Learn.")).toBeInTheDocument();
  });

  it("provides the primary sign-up links", () => {
    render(<LandingPage />);

    expect(screen.getByRole("link", { name: /Get started/i })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /Create a free account/i })).toHaveAttribute("href", "/login");
  });
});
