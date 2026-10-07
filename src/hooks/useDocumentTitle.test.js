import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import useDocumentTitle from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  it("should set document title with app name suffix when title is provided", () => {
    renderHook(() => useDocumentTitle("Beranda"));
    expect(document.title).toBe("Beranda | Lost & Founds");
  });

  it("should set document title to app name when title is empty or falsy", () => {
    renderHook(() => useDocumentTitle(""));
    expect(document.title).toBe("Lost & Founds");
  });
});
