import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setUsersActionCreator,
  setUserActionCreator,
  setProfileActionCreator,
  setIsProfileActionCreator,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
  asyncSetUsers,
  asyncSetProfile,
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "./action";
import userApi from "../api/userApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("users action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create correct action objects", () => {
    expect(setUsersActionCreator([{ id: 1 }])).toEqual({
      type: ActionType.SET_USERS,
      payload: [{ id: 1 }],
    });
    expect(setUserActionCreator({ id: 1 })).toEqual({
      type: ActionType.SET_USER,
      payload: { id: 1 },
    });
    expect(setProfileActionCreator({ id: 1 })).toEqual({
      type: ActionType.SET_PROFILE,
      payload: { id: 1 },
    });
    expect(setIsProfileActionCreator(true)).toEqual({
      type: ActionType.SET_IS_PROFILE,
      payload: true,
    });
    expect(setIsChangeProfileActionCreator(true)).toEqual({
      type: ActionType.SET_IS_CHANGE_PROFILE,
      payload: true,
    });
    expect(setIsChangeProfilePhotoActionCreator(true)).toEqual({
      type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
      payload: true,
    });
    expect(setIsChangeProfilePasswordActionCreator(true)).toEqual({
      type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
      payload: true,
    });
  });

  describe("asyncSetUsers", () => {
    it("should dispatch setUsersActionCreator with users on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "getUsers").mockResolvedValue([{ id: 1 }]);

      await asyncSetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator([{ id: 1 }]));
    });

    it("should dispatch empty array and show error dialog on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "getUsers").mockRejectedValue(new Error("Error"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      await asyncSetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator([]));
      expect(errorSpy).toHaveBeenCalledWith("Error");
    });
  });

  describe("asyncSetProfile", () => {
    it("should dispatch setProfileActionCreator and return true on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "getMe").mockResolvedValue({ id: 3 });

      const ok = await asyncSetProfile()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator({ id: 3 }));
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(false));
      expect(ok).toBe(true);
    });

    it("should dispatch null and return false on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "getMe").mockRejectedValue(new Error("Failed"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      const ok = await asyncSetProfile()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(null));
      expect(errorSpy).toHaveBeenCalledWith("Failed");
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(false));
      expect(ok).toBe(false);
    });
  });

  describe("asyncChangeProfile", () => {
    it("should update profile and refresh profile on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMe").mockResolvedValue("Berhasil");
      vi.spyOn(userApi, "getMe").mockResolvedValue({ id: 1, name: "New Name" });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      const ok = await asyncChangeProfile("New Name", "new@del.org")(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfileActionCreator(true));
      expect(successSpy).toHaveBeenCalledWith("Berhasil");
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator({ id: 1, name: "New Name" }));
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfileActionCreator(false));
      expect(ok).toBe(true);
    });

    it("should handle error when refreshProfile fails during successful mutation", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMe").mockResolvedValue("Berhasil");
      vi.spyOn(userApi, "getMe").mockRejectedValue(new Error("Gagal refresh"));
      vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      const ok = await asyncChangeProfile("New Name", "new@del.org")(dispatch);
      expect(ok).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMe").mockRejectedValue(new Error("Gagal update"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      const ok = await asyncChangeProfile("New Name", "new@del.org")(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Gagal update");
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfileActionCreator(false));
      expect(ok).toBe(false);
    });
  });

  describe("asyncChangeProfilePhoto", () => {
    it("should upload photo, refresh profile, and show success dialog", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "postMePhoto").mockResolvedValue("Foto profil diubah");
      vi.spyOn(userApi, "getMe").mockResolvedValue({ id: 1, photo: "new.jpg" });
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      const dummyFile = new File([""], "test.png");
      const ok = await asyncChangeProfilePhoto(dummyFile)(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Foto profil diubah");
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator({ id: 1, photo: "new.jpg" }));
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePhotoActionCreator(false));
      expect(ok).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "postMePhoto").mockRejectedValue(new Error("File terlalu besar"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      const dummyFile = new File([""], "test.png");
      const ok = await asyncChangeProfilePhoto(dummyFile)(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("File terlalu besar");
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePhotoActionCreator(false));
      expect(ok).toBe(false);
    });
  });

  describe("asyncChangeProfilePassword", () => {
    it("should update password, show success dialog, and return true", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMePassword").mockResolvedValue("Password diubah");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});

      const ok = await asyncChangeProfilePassword("old", "new")(dispatch);

      expect(successSpy).toHaveBeenCalledWith("Password diubah");
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePasswordActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePasswordActionCreator(false));
      expect(ok).toBe(true);
    });

    it("should show error dialog and return false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMePassword").mockRejectedValue(new Error("Password salah"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

      const ok = await asyncChangeProfilePassword("old", "new")(dispatch);

      expect(errorSpy).toHaveBeenCalledWith("Password salah");
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePasswordActionCreator(false));
      expect(ok).toBe(false);
    });
  });
});
