import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setLostFoundsActionCreator,
  setLostFoundActionCreator,
  setLostFoundStatsActionCreator,
  setIsLostFoundActionCreator,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
  setIsLostFoundChangeActionCreator,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundChangeCoverActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  setIsLostFoundDeleteActionCreator,
  setIsLostFoundDeletedActionCreator,
  asyncSetLostFounds,
  asyncSetLostFound,
  asyncSetLostFoundStats,
  asyncAddLostFound,
  asyncChangeLostFound,
  asyncChangeLostFoundCover,
  asyncDeleteLostFound,
} from "./action";
import lostFoundApi from "../api/lostFoundApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("lost found actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create action objects correctly", () => {
    expect(setLostFoundsActionCreator([{ id: 1 }])).toEqual({
      type: ActionType.SET_LOST_FOUNDS,
      payload: [{ id: 1 }],
    });

    expect(setLostFoundActionCreator({ id: 1 })).toEqual({
      type: ActionType.SET_LOST_FOUND,
      payload: { id: 1 },
    });

    const stats = {
      daily: [],
      monthly: [],
    };

    expect(setLostFoundStatsActionCreator(stats)).toEqual({
      type: ActionType.SET_LOST_FOUND_STATS,
      payload: stats,
    });

    expect(setIsLostFoundActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND,
      payload: true,
    });

    expect(setIsLostFoundAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_ADD,
      payload: true,
    });

    expect(setIsLostFoundAddedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_ADDED,
      payload: true,
    });

    expect(setIsLostFoundChangeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGE,
      payload: true,
    });

    expect(setIsLostFoundChangedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGED,
      payload: true,
    });

    expect(setIsLostFoundChangeCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
      payload: true,
    });

    expect(setIsLostFoundChangedCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
      payload: true,
    });

    expect(setIsLostFoundDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_DELETE,
      payload: true,
    });

    expect(setIsLostFoundDeletedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_LOST_FOUND_DELETED,
      payload: true,
    });
  });

  describe("asyncSetLostFounds", () => {
    it("should dispatch reports on success", async () => {
      const dispatch = vi.fn();
      const reports = [{ id: 1 }];

      vi.spyOn(lostFoundApi, "getLostFounds").mockResolvedValue(reports);

      await asyncSetLostFounds({ status: "lost" })(dispatch);

      expect(lostFoundApi.getLostFounds).toHaveBeenCalledWith({
        status: "lost",
      });

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundsActionCreator(reports)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundActionCreator(true)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundActionCreator(false)
      );
    });

    it("should dispatch empty array on error", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "getLostFounds").mockRejectedValue(
        new Error("Gagal mengambil laporan")
      );

      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue(undefined);

      await asyncSetLostFounds()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundsActionCreator([])
      );

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Gagal mengambil laporan"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundActionCreator(false)
      );
    });
  });

  describe("asyncSetLostFound", () => {
    it("should dispatch detail report on success", async () => {
      const dispatch = vi.fn();
      const report = { id: 1, title: "Dompet Hilang" };

      vi.spyOn(lostFoundApi, "getLostFoundById").mockResolvedValue(report);

      await asyncSetLostFound(1)(dispatch);

      expect(lostFoundApi.getLostFoundById).toHaveBeenCalledWith(1);

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundActionCreator(report)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundActionCreator(true)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundActionCreator(false)
      );
    });

    it("should dispatch null on error", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "getLostFoundById").mockRejectedValue(
        new Error("Laporan tidak ditemukan")
      );

      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue(undefined);

      await asyncSetLostFound(99)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundActionCreator(null)
      );

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Laporan tidak ditemukan"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundActionCreator(false)
      );
    });
  });

  describe("asyncSetLostFoundStats", () => {
    it("should dispatch daily and monthly statistics", async () => {
      const dispatch = vi.fn();

      const daily = [{ date: "2026-10-01", total: 2 }];
      const monthly = [{ month: "2026-10", total: 8 }];

      vi.spyOn(lostFoundApi, "getStatsDaily").mockResolvedValue(daily);
      vi.spyOn(lostFoundApi, "getStatsMonthly").mockResolvedValue(monthly);

      await asyncSetLostFoundStats()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundStatsActionCreator({
          daily,
          monthly,
        })
      );
    });

    it("should dispatch null when statistics loading fails", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "getStatsDaily").mockRejectedValue(
        new Error("Gagal")
      );

      vi.spyOn(lostFoundApi, "getStatsMonthly").mockResolvedValue([]);

      await asyncSetLostFoundStats()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        setLostFoundStatsActionCreator(null)
      );
    });
  });

  describe("asyncAddLostFound", () => {
    it("should add a lost found report successfully", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "postLostFound").mockResolvedValue(
        "Laporan berhasil ditambahkan"
      );

      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncAddLostFound(
        "Dompet Hilang",
        "Dompet hilang di kantin",
        "lost"
      )(dispatch);

      expect(lostFoundApi.postLostFound).toHaveBeenCalledWith(
        "Dompet Hilang",
        "Dompet hilang di kantin",
        "lost"
      );

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Laporan berhasil ditambahkan"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundAddActionCreator(true)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundAddedActionCreator(false)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundAddedActionCreator(true)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundAddActionCreator(false)
      );

      expect(result).toBe(true);
    });

    it("should return false when adding fails", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "postLostFound").mockRejectedValue(
        new Error("Gagal tambah")
      );

      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncAddLostFound(
        "Judul",
        "Deskripsi",
        "lost"
      )(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Gagal tambah"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundAddedActionCreator(false)
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundAddActionCreator(false)
      );

      expect(result).toBe(false);
    });
  });

  describe("asyncChangeLostFound", () => {
    it("should update a report successfully", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "putLostFound").mockResolvedValue(
        "Laporan berhasil diubah"
      );

      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncChangeLostFound(
        1,
        "Judul Baru",
        "Deskripsi Baru",
        "found",
        true
      )(dispatch);

      expect(lostFoundApi.putLostFound).toHaveBeenCalledWith(
        1,
        "Judul Baru",
        "Deskripsi Baru",
        "found",
        true
      );

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Laporan berhasil diubah"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundChangedActionCreator(true)
      );

      expect(result).toBe(true);
    });

    it("should return false when update fails", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "putLostFound").mockRejectedValue(
        new Error("Gagal update")
      );

      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncChangeLostFound(
        1,
        "Judul",
        "Deskripsi",
        "lost",
        false
      )(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Gagal update"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundChangedActionCreator(false)
      );

      expect(result).toBe(false);
    });
  });

  describe("asyncChangeLostFoundCover", () => {
    it("should upload cover successfully", async () => {
      const dispatch = vi.fn();
      const file = new File(["image"], "cover.jpg", {
        type: "image/jpeg",
      });

      vi.spyOn(lostFoundApi, "postLostFoundCover").mockResolvedValue(
        "Cover berhasil diubah"
      );

      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncChangeLostFoundCover(1, file)(dispatch);

      expect(lostFoundApi.postLostFoundCover).toHaveBeenCalledWith(
        1,
        file
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundChangedCoverActionCreator(true)
      );

      expect(result).toBe(true);
    });

    it("should return false when cover upload fails", async () => {
      const dispatch = vi.fn();
      const file = new File(["image"], "cover.jpg", {
        type: "image/jpeg",
      });

      vi.spyOn(lostFoundApi, "postLostFoundCover").mockRejectedValue(
        new Error("File corrupt")
      );

      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncChangeLostFoundCover(1, file)(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "File corrupt"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundChangedCoverActionCreator(false)
      );

      expect(result).toBe(false);
    });
  });

  describe("asyncDeleteLostFound", () => {
    it("should delete a report successfully", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "deleteLostFound").mockResolvedValue(
        "Laporan berhasil dihapus"
      );

      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncDeleteLostFound(1)(dispatch);

      expect(lostFoundApi.deleteLostFound).toHaveBeenCalledWith(1);

      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith(
        "Laporan berhasil dihapus"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundDeletedActionCreator(true)
      );

      expect(result).toBe(true);
    });

    it("should return false when deletion fails", async () => {
      const dispatch = vi.fn();

      vi.spyOn(lostFoundApi, "deleteLostFound").mockRejectedValue(
        new Error("Gagal hapus")
      );

      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue(
        undefined
      );

      const result = await asyncDeleteLostFound(1)(dispatch);

      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
        "Gagal hapus"
      );

      expect(dispatch).toHaveBeenCalledWith(
        setIsLostFoundDeletedActionCreator(false)
      );

      expect(result).toBe(false);
    });
  });
});