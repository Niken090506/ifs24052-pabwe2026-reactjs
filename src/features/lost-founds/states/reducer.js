import { ActionType } from "./action";
import { createFlagReducer } from "../../../helpers/thunkHelper";

export const lostFoundsReducer = (state = [], action = {}) =>
  action.type === ActionType.SET_LOST_FOUNDS ? action.payload : state;

export const lostFoundReducer = (state = null, action = {}) =>
  action.type === ActionType.SET_LOST_FOUND ? action.payload : state;

export const lostFoundStatsReducer = (state = null, action = {}) =>
  action.type === ActionType.SET_LOST_FOUND_STATS ? action.payload : state;

export const isLostFoundReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND);
export const isLostFoundAddReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_ADD);
export const isLostFoundAddedReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_ADDED);
export const isLostFoundChangeReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_CHANGE);
export const isLostFoundChangedReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_CHANGED);
export const isLostFoundChangeCoverReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_CHANGE_COVER);
export const isLostFoundChangedCoverReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_CHANGED_COVER);
export const isLostFoundDeleteReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_DELETE);
export const isLostFoundDeletedReducer = createFlagReducer(ActionType.SET_IS_LOST_FOUND_DELETED);