import { describe, expect, it } from "vitest";
import { toStatRows } from "./statsHelper";

describe("toStatRows", () => {
  it("should return empty array if data is null or undefined", () => {
    expect(toStatRows(null)).toEqual([]);
    expect(toStatRows(undefined)).toEqual([]);
  });

  it("should map array of stats using date, month, label, period and total, count", () => {
    const input = [
      { date: "2026-03-01", total: 10 },
      { month: "Maret", count: 20 },
      { label: "Minggu 1", total: 5 },
      { period: "Q1" },
      {},
    ];
    expect(toStatRows(input)).toEqual([
      { label: "2026-03-01", total: 10 },
      { label: "Maret", total: 20 },
      { label: "Minggu 1", total: 5 },
      { label: "Q1", total: 0 },
      { label: "-", total: 0 },
    ]);
  });

  it("should extract list if data is an object containing an array property", () => {
    const input = {
      title: "Data Harian",
      items: [{ date: "2026-03-01", total: 12 }],
    };
    expect(toStatRows(input)).toEqual([{ label: "2026-03-01", total: 12 }]);
  });

  it("should map object entries if no nested array exists and values are numbers", () => {
    const input = {
      "2026-01": 15,
      "2026-02": 25,
      meta: "ignored string",
    };
    expect(toStatRows(input)).toEqual([
      { label: "2026-01", total: 15 },
      { label: "2026-02", total: 25 },
    ]);
  });
});
