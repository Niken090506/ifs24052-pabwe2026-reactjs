import { describe, expect, it } from "vitest";
import {
  STATUS_LABEL,
  countMetrics,
  getReporterName,
  isCompleted,
  isOwnedBy,
} from "./lostFoundHelper";

describe("lostFoundHelper", () => {
  it("should have correct STATUS_LABEL mappings", () => {
    expect(STATUS_LABEL.lost).toBe("Hilang");
    expect(STATUS_LABEL.found).toBe("Ditemukan");
  });

  describe("isCompleted", () => {
    it("should return true when is_completed is 1 or truthy numeric string", () => {
      expect(isCompleted({ is_completed: 1 })).toBe(true);
      expect(isCompleted({ is_completed: "1" })).toBe(true);
    });

    it("should return false when is_completed is 0 or null or undefined", () => {
      expect(isCompleted({ is_completed: 0 })).toBe(false);
      expect(isCompleted({ is_completed: null })).toBe(false);
      expect(isCompleted(null)).toBe(false);
    });
  });

  describe("getReporterName", () => {
    it("should return item.user.name when present", () => {
      expect(getReporterName({ user: { name: "Budi" } })).toBe("Budi");
    });

    it("should fallback to item.author.name", () => {
      expect(getReporterName({ author: { name: "Ani" } })).toBe("Ani");
    });

    it("should fallback to item.user_name", () => {
      expect(getReporterName({ user_name: "Candra" })).toBe("Candra");
    });

    it("should fallback to Pengguna when none are provided", () => {
      expect(getReporterName({})).toBe("Pengguna");
      expect(getReporterName(null)).toBe("Pengguna");
    });
  });

  describe("isOwnedBy", () => {
    it("should return true when item has no owner ID", () => {
      expect(isOwnedBy({}, { id: "user-1" })).toBe(true);
      expect(isOwnedBy(null, { id: "user-1" })).toBe(true);
      expect(isOwnedBy({ user_id: null }, { id: "user-1" })).toBe(true);
      expect(isOwnedBy({ user_id: undefined }, { id: "user-1" })).toBe(true);
    });

    it("should check owner match with user_id or user.id", () => {
      expect(isOwnedBy({ user_id: "user-1" }, { id: "user-1" })).toBe(true);
      expect(isOwnedBy({ user_id: "user-1" }, { id: "user-2" })).toBe(false);
      expect(isOwnedBy({ user: { id: "user-1" } }, { id: "user-1" })).toBe(true);
      expect(isOwnedBy({ user: { id: "user-1" } }, { id: "user-2" })).toBe(false);
      expect(isOwnedBy({ user_id: "user-1" }, null)).toBe(false);
    });
  });

  describe("countMetrics", () => {
    it("should count total, lost, found, and completed items", () => {
      const items = [
        { status: "lost", is_completed: 0 },
        { status: "lost", is_completed: 1 },
        { status: "found", is_completed: 1 },
        { status: "found", is_completed: 0 },
      ];
      expect(countMetrics(items)).toEqual({
        total: 4,
        lost: 2,
        found: 2,
        completed: 2,
      });
    });

    it("should handle empty list", () => {
      expect(countMetrics([])).toEqual({
        total: 0,
        lost: 0,
        found: 0,
        completed: 0,
      });
    });
  });
});
