import apiHelper from "../../../helpers/apiHelper";
import { parseResponse } from "../../../helpers/responseHelper";

const userApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/users`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function getUsers() {
    const response = await apiHelper.fetchData(_url("/"), { method: "GET" });
    const result = await parseResponse(response, "Gagal mengambil daftar pengguna");
    return result.data?.users || [];
  }

  async function getMe() {
    const response = await apiHelper.fetchData(_url("/me"), { method: "GET" });
    const result = await parseResponse(response, "Gagal mengambil data profil");
    return result.data?.user;
  }

  async function putMe(name, email) {
    const response = await apiHelper.fetchData(_url("/me"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const result = await parseResponse(response, "Gagal mengubah profil");
    return result.message;
  }

  async function postMePhoto(photo) {
    const formData = new FormData();
    formData.append("photo", photo, photo.name || "photo.jpg");
    const response = await apiHelper.fetchData(_url("/me/photo"), {
      method: "POST",
      body: formData,
    });
    const result = await parseResponse(response, "Gagal mengubah foto profil");
    return result.message;
  }

  async function putMePassword(password, newPassword) {
    const response = await apiHelper.fetchData(_url("/me/password"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, new_password: newPassword }),
    });
    const result = await parseResponse(response, "Gagal mengubah kata sandi");
    return result.message;
  }

  return { getUsers, getMe, putMe, postMePhoto, putMePassword };
})();

export default userApi;