import { describe, expect, it } from "vitest";
import { parseResponse } from "./responseHelper";

describe("parseResponse", () => {
  it("should return json result when response has status 'success'", async () => {
    const mockResponse = {
      json: async () => ({ status: "success", data: { id: 1 } }),
    };
    const result = await parseResponse(mockResponse, "Gagal");
    expect(result).toEqual({ status: "success", data: { id: 1 } });
  });

  it("should return json result when response has success true", async () => {
    const mockResponse = {
      json: async () => ({ success: true, message: "OK" }),
    };
    const result = await parseResponse(mockResponse, "Gagal");
    expect(result).toEqual({ success: true, message: "OK" });
  });

  it("should throw error with result message when request fails", async () => {
    const mockResponse = {
      json: async () => ({ status: "fail", message: "Data tidak valid" }),
    };
    await expect(parseResponse(mockResponse, "Fallback error")).rejects.toThrow("Data tidak valid");
  });

  it("should throw error with fallback message when result message is empty", async () => {
    const mockResponse = {
      json: async () => ({ status: "error" }),
    };
    await expect(parseResponse(mockResponse, "Fallback error")).rejects.toThrow("Fallback error");
  });
});
