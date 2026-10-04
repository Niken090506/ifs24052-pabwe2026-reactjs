import apiHelper from "../../../helpers/apiHelper";
import { parseResponse } from "../../../helpers/responseHelper";

const authApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/auth`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postLogin(email, password) {
    const response = await apiHelper.fetchData(_url("/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await parseResponse(response, "Gagal masuk ke akun");
    return result.data;
  }

  async function postRegister(name, email, password) {
    const response = await apiHelper.fetchData(_url("/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await parseResponse(response, "Gagal mendaftarkan akun");
    return result.message;
  }

  async function postLogout() {
    const response = await apiHelper.fetchData(_url("/logout"), {
      method: "POST",
    });
    const result = await parseResponse(response, "Gagal keluar dari akun");
    return result.message;
  }

  return { postLogin, postRegister, postLogout };
})();

export default authApi;