import { showErrorDialog, showSuccessDialog } from "./toolsHelper";

/**
 * Membuat thunk untuk aksi mutasi (tambah/ubah/hapus).
 * - setStart(value): menandai proses sedang berjalan
 * - setDone(value): (opsional) menandai hasil proses (berhasil / gagal)
 * - run(): fungsi async yang memanggil API dan mengembalikan pesan
 * Thunk mengembalikan true bila berhasil dan false bila gagal.
 */
export function createMutationThunk({ setStart, setDone, run, showSuccess = true }) {
  return async (dispatch) => {
    const markDone = (value) => {
      if (setDone) {
        dispatch(setDone(value));
      }
    };
    dispatch(setStart(true));
    markDone(false);
    try {
      const message = await run();
      markDone(true);
      if (showSuccess) {
        await showSuccessDialog(message);
      }
      return true;
    } catch (error) {
      markDone(false);
      await showErrorDialog(error.message);
      return false;
    } finally {
      dispatch(setStart(false));
    }
  };
}

/**
 * Membuat reducer sederhana untuk flag dari satu action type.
 */
export function createFlagReducer(type, initialValue = false) {
  return (state = initialValue, action = {}) =>
    action.type === type ? action.payload : state;
}