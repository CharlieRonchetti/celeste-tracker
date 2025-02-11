import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Home from "../src/pages/Home";
import { describe, it, expect } from "vitest";
import React from "react";

describe("Leaderboard Page", () => {
  it("should render the home page", () => {
    render(<Home />);
    expect(screen.getByText("Welcome to the Celeste Speedrun Tracker")).toBeInTheDocument();
  });
});