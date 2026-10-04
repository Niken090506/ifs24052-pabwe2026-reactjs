import { showErrorDialog } from "../../../helpers/toolsHelper";
import { createMutationThunk } from "../../../helpers/thunkHelper";
import lostFoundApi from "../api/lostFoundApi";

export const ActionType = {
  SET_LOST_FOUNDS: "SET_LOST_FOUNDS",
  SET_LOST_FOUND: "SET_LOST_FOUND",
  SET_IS_LOST_FOUND: "SET_IS_LOST_FOUND",
  SET_LOST_FOUND_STATS: "SET_LOST_FOUND_STATS",
  SET_IS_LOST_FOUND_ADD: "SET_IS_LOST_FOUND_ADD",
  SET_IS_LOST_FOUND_ADDED: "SET_IS_LOST_FOUND_ADDED",
  SET_IS_LOST_FOUND_CHANGE: "SET_IS_LOST_FOUND_CHANGE",
  SET_IS_LOST_FOUND_CHANGED: "SET_IS_LOST_FOUND_CHANGED",
  SET_IS_LOST_FOUND_CHANGE_COVER: "SET_IS_LOST_FOUND_CHANGE_COVER",
  SET_IS_LOST_FOUND_CHANGED_COVER: "SET_IS_LOST_FOUND_CHANGED_COVER",
  SET_IS_LOST_FOUND_DELETE: "SET_IS_LOST_FOUND_DELETE",
  SET_IS_LOST_FOUND_DELETED: "SET_IS_LOST_FOUND_DELETED",
};

const flag = (type) => (value) => ({ type, payload: value });

export const setLostFoundsActionCreator = (lostFounds) => ({
  type: ActionType.SET_LOST_FOUNDS,
  payload: lostFounds,
});

export const setLostFoundActionCreator = (lostFound) => ({
  type: ActionType.SET_LOST_FOUND,
  payload: lostFound,
});

export const setLostFoundStatsActionCreator = (stats) => ({
  type: ActionType.SET_LOST_FOUND_STATS,
  payload: stats,
});

export const setIsLostFoundActionCreator = flag(ActionType.SET_IS_LOST_FOUND);
export const setIsLostFoundAddActionCreator = flag(ActionType.SET_IS_LOST_FOUND_ADD);
export const setIsLostFoundAddedActionCreator = flag(ActionType.SET_IS_LOST_FOUND_ADDED);
export const setIsLostFoundChangeActionCreator = flag(ActionType.SET_IS_LOST_FOUND_CHANGE);
export const setIsLostFoundChangedActionCreator = flag(ActionType.SET_IS_LOST_FOUND_CHANGED);
export const setIsLostFoundChangeCoverActionCreator = flag(ActionType.SET_IS_LOST_FOUND_CHANGE_COVER);
export const setIsLostFoundChangedCoverActionCreator = flag(ActionType.SET_IS_LOST_FOUND_CHANGED_COVER);
export const setIsLostFoundDeleteActionCreator = flag(ActionType.SET_IS_LOST_FOUND_DELETE);
export const setIsLostFoundDeletedActionCreator = flag(ActionType.SET_IS_LOST_FOUND_DELETED);

export function asyncSetLostFounds(filters = {}) {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(true));
    try {
      const lostFounds = await lostFoundApi.getLostFounds(filters);
      dispatch(setLostFoundsActionCreator(lostFounds));
    } catch (error) {
      dispatch(setLostFoundsActionCreator([]));
      await showErrorDialog(error.message);
    } finally {
      dispatch(setIsLostFoundActionCreator(false));
    }
  };
}

export function asyncSetLostFound(lostFoundId) {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(true));
    try {
      const lostFound = await lostFoundApi.getLostFoundById(lostFoundId);
      dispatch(setLostFoundActionCreator(lostFound));
    } catch (error) {
      dispatch(setLostFoundActionCreator(null));
      await showErrorDialog(error.message);
    } finally {
      dispatch(setIsLostFoundActionCreator(false));
    }
  };
}

export function asyncSetLostFoundStats() {
  return async (dispatch) => {
    try {
      const [daily, monthly] = await Promise.all([
        lostFoundApi.getStatsDaily(),
        lostFoundApi.getStatsMonthly(),
      ]);
      dispatch(setLostFoundStatsActionCreator({ daily, monthly }));
    } catch {
      dispatch(setLostFoundStatsActionCreator(null));
    }
  };
}

export const asyncAddLostFound = (title, description, status) =>
  createMutationThunk({
    setStart: setIsLostFoundAddActionCreator,
    setDone: setIsLostFoundAddedActionCreator,
    run: () => lostFoundApi.postLostFound(title, description, status),
  });

export const asyncChangeLostFound = (id, title, description, status, isCompleted) =>
  createMutationThunk({
    setStart: setIsLostFoundChangeActionCreator,
    setDone: setIsLostFoundChangedActionCreator,
    run: () => lostFoundApi.putLostFound(id, title, description, status, isCompleted),
  });

export const asyncChangeLostFoundCover = (id, cover) =>
  createMutationThunk({
    setStart: setIsLostFoundChangeCoverActionCreator,
    setDone: setIsLostFoundChangedCoverActionCreator,
    run: () => lostFoundApi.postLostFoundCover(id, cover),
  });

export const asyncDeleteLostFound = (id) =>
  createMutationThunk({
    setStart: setIsLostFoundDeleteActionCreator,
    setDone: setIsLostFoundDeletedActionCreator,
    run: () => lostFoundApi.deleteLostFound(id),
  });