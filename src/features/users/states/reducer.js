import { ActionType } from "./action";
import { createFlagReducer } from "../../../helpers/thunkHelper";

export const usersReducer = (state = [], action = {}) =>
  action.type === ActionType.SET_USERS ? action.payload : state;

export const userReducer = (state = null, action = {}) =>
  action.type === ActionType.SET_USER ? action.payload : state;

export const profileReducer = (state = null, action = {}) =>
  action.type === ActionType.SET_PROFILE ? action.payload : state;

export const isProfileReducer = createFlagReducer(ActionType.SET_IS_PROFILE);
export const isChangeProfileReducer = createFlagReducer(ActionType.SET_IS_CHANGE_PROFILE);
export const isChangeProfilePhotoReducer = createFlagReducer(ActionType.SET_IS_CHANGE_PROFILE_PHOTO);
export const isChangeProfilePasswordReducer = createFlagReducer(ActionType.SET_IS_CHANGE_PROFILE_PASSWORD);