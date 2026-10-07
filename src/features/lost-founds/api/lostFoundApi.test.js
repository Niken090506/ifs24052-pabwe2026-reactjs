import { describe, it, expect, vi, beforeEach } from "vitest";
import lostFoundApi from "./lostFoundApi";
import apiHelper from "../../../helpers/apiHelper";

describe("lostFoundApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postLostFound", () => {
    it("should create new lostFound and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menambahkan laporan",
        }),
      });

      const res = await lostFoundApi.postLostFound("Title", "Description", "lost");
      expect(res).toBe("Berhasil menambahkan laporan");
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(lostFoundApi.postLostFound("", "", "lost")).rejects.toThrow("Data tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.postLostFound("", "", "lost")).rejects.toThrow("Gagal menambahkan laporan");
    });
  });

  describe("postLostFoundCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await lostFoundApi.postLostFoundCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await lostFoundApi.postLostFoundCover(1, dummyBlob);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should throw error on upload failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      await expect(lostFoundApi.postLostFoundCover(1, dummyFile)).rejects.toThrow(
        "Format tidak didukung"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      await expect(lostFoundApi.postLostFoundCover(1, dummyFile)).rejects.toThrow(
        "Gagal mengubah cover"
      );
    });
  });

  describe("putLostFound", () => {
    it("should update lostFound and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah laporan",
        }),
      });

      const msg = await lostFoundApi.putLostFound(1, "Updated", "Desc", "found", true);
      expect(msg).toBe("Berhasil mengubah laporan");
    });

    it("should handle completion false properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah laporan",
        }),
      });

      const msg = await lostFoundApi.putLostFound(1, "Updated", "Desc", "lost", false);
      expect(msg).toBe("Berhasil mengubah laporan");
    });

    it("should throw error on update failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal update laporan",
        }),
      });

      await expect(lostFoundApi.putLostFound(1, "", "", "lost", false)).rejects.toThrow("Gagal update laporan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.putLostFound(1, "", "", "lost", false)).rejects.toThrow("Gagal mengubah laporan");
    });
  });

  describe("getLostFounds", () => {
    it("should fetch all lost-founds without filter", async () => {
      const mockList = [{ id: 1, title: "Lost 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockList },
        }),
      });

      const items = await lostFoundApi.getLostFounds();
      expect(items).toEqual(mockList);
    });

    it("should fetch filtered lost-founds when parameters provided", async () => {
      const mockList = [{ id: 2, title: "Found 2", status: "found" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_founds: mockList },
        }),
      });

      const items = await lostFoundApi.getLostFounds({ status: "found", is_completed: 1, empty: "" });
      expect(items).toEqual(mockList);
    });

    it("should fallback to lostFounds camelCase or empty array if missing", async () => {
      const mockList = [{ id: 3, title: "CamelCase" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          data: { lostFounds: mockList },
        }),
      });

      let items = await lostFoundApi.getLostFounds();
      expect(items).toEqual(mockList);

      vi.spyOn(apiHelper, "fetchData").mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          data: null,
        }),
      });

      items = await lostFoundApi.getLostFounds();
      expect(items).toEqual([]);
    });

    it("should throw error on fetch failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses tidak diizinkan",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow("Akses tidak diizinkan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getLostFounds()).rejects.toThrow("Gagal mengambil data laporan");
    });
  });

  describe("getLostFoundById", () => {
    it("should return single lost-found object on success", async () => {
      const mockItem = { id: 5, title: "Single" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { lost_found: mockItem },
        }),
      });

      const res = await lostFoundApi.getLostFoundById(5);
      expect(res).toEqual(mockItem);
    });

    it("should fallback to lostFound camelCase or null if missing", async () => {
      const mockItem = { id: 6, title: "Camel" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          data: { lostFound: mockItem },
        }),
      });

      let res = await lostFoundApi.getLostFoundById(6);
      expect(res).toEqual(mockItem);

      vi.spyOn(apiHelper, "fetchData").mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          data: null,
        }),
      });

      res = await lostFoundApi.getLostFoundById(6);
      expect(res).toBeNull();
    });

    it("should throw error when not found", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Laporan tidak ditemukan",
        }),
      });

      await expect(lostFoundApi.getLostFoundById(999)).rejects.toThrow("Laporan tidak ditemukan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getLostFoundById(999)).rejects.toThrow("Gagal mengambil detail laporan");
    });
  });

  describe("deleteLostFound", () => {
    it("should delete and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus laporan",
        }),
      });

      const msg = await lostFoundApi.deleteLostFound(1);
      expect(msg).toBe("Berhasil menghapus laporan");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tidak dapat menghapus",
        }),
      });

      await expect(lostFoundApi.deleteLostFound(1)).rejects.toThrow("Tidak dapat menghapus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.deleteLostFound(1)).rejects.toThrow("Gagal menghapus laporan");
    });
  });

  describe("getStatsDaily", () => {
    it("should fetch daily stats", async () => {
      const mockDaily = [{ date: "2026-10-01", total: 3 }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: mockDaily,
        }),
      });

      const res = await lostFoundApi.getStatsDaily();
      expect(res).toEqual(mockDaily);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getStatsDaily()).rejects.toThrow("Gagal mengambil statistik harian");
    });
  });

  describe("getStatsMonthly", () => {
    it("should fetch monthly stats", async () => {
      const mockMonthly = [{ month: "2026-10", total: 10 }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: mockMonthly,
        }),
      });

      const res = await lostFoundApi.getStatsMonthly();
      expect(res).toEqual(mockMonthly);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(lostFoundApi.getStatsMonthly()).rejects.toThrow("Gagal mengambil statistik bulanan");
    });
  });
});
