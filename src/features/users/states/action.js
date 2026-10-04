import { showErrorDialog } from "../../../helpers/toolsHelper";
import { createMutationThunk } from "../../../helpers/thunkHelper";
import userApi from "../api/userApi";

export const ActionType = {
  SET_USERS: "SET_USERS",
  SET_USER: "SET_USER",
  SET_PROFILE: "SET_PROFILE",
  SET_IS_PROFILE: "SET_IS_PROFILE",
  SET_IS_CHANGE_PROFILE: "SET_IS_CHANGE_PROFILE",
  SET_IS_CHANGE_PROFILE_PHOTO: "SET_IS_CHANGE_PROFILE_PHOTO",
  SET_IS_CHANGE_PROFILE_PASSWORD: "SET_IS_CHANGE_PROFILE_PASSWORD",
};

export const setUsersActionCreator = (users) => ({
  type: ActionType.SET_USERS,
  payload: users,
});

export const setUserActionCreator = (user) => ({
  type: ActionType.SET_USER,
  payload: user,
});

export const setProfileActionCreator = (profile) => ({
  type: ActionType.SET_PROFILE,
  payload: profile,
});

export const setIsProfileActionCreator = (isProfile) => ({
  type: ActionType.SET_IS_PROFILE,
  payload: isProfile,
});

export const setIsChangeProfileActionCreator = (value) => ({
  type: ActionType.SET_IS_CHANGE_PROFILE,
  payload: value,
});

export const setIsChangeProfilePhotoActionCreator = (value) => ({
  type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
  payload: value,
});

export const setIsChangeProfilePasswordActionCreator = (value) => ({
  type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
  payload: value,
});

export function asyncSetUsers() {
  return async (dispatch) => {
    try {
      const users = await userApi.getUsers();
      dispatch(setUsersActionCreator(users));
    } catch (error) {
      dispatch(setUsersActionCreator([]));
      await showErrorDialog(error.message);
    }
  };
}

// Mengembalikan true bila profil berhasil dimuat (dipakai route guarding)
export function asyncSetProfile() {
  return async (dispatch) => {
    dispatch(setIsProfileActionCreator(true));
    try {
      const profile = await userApi.getMe();
      dispatch(setProfileActionCreator(profile));
      return true;
    } catch (error) {
      dispatch(setProfileActionCreator(null));
      await showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(setIsProfileActionCreator(false));
    }
  };
}

const refreshProfile = async (dispatch) => {
  try {
    dispatch(setProfileActionCreator(await userApi.getMe()));
  } catch {
    // profil lama tetap dipakai bila penyegaran gagal
  }
};

export function asyncChangeProfile(name, email) {
  const thunk = createMutationThunk({
    setStart: setIsChangeProfileActionCreator,
    run: () => userApi.putMe(name, email),
  });
  return async (dispatch) => {
    const ok = await thunk(dispatch);
    if (ok) {
      await refreshProfile(dispatch);
    }
    return ok;
  };
}

export function asyncChangeProfilePhoto(photo) {
  const thunk = createMutationThunk({
    setStart: setIsChangeProfilePhotoActionCreator,
    run: () => userApi.postMePhoto(photo),
  });
  return async (dispatch) => {
    const ok = await thunk(dispatch);
    if (ok) {
      await refreshProfile(dispatch);
    }
    return ok;
  };
}

export function asyncChangeProfilePassword(password, newPassword) {
  return createMutationThunk({
    setStart: setIsChangeProfilePasswordActionCreator,
    run: () => userApi.putMePassword(password, newPassword),
  });
}