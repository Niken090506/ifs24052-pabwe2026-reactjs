import apiHelper from "../../../helpers/apiHelper";
import { parseResponse } from "../../../helpers/responseHelper";

const lostFoundApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/lost-founds`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postLostFound(title, description, status) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status }),
    });
    const result = await parseResponse(response, "Gagal menambahkan laporan");
    return result.message;
  }

  async function postLostFoundCover(lostFoundId, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${lostFoundId}/cover`), {
      method: "POST",
      body: formData,
    });
    const result = await parseResponse(response, "Gagal mengubah cover");
    return result.message;
  }

  async function putLostFound(lostFoundId, title, description, status, isCompleted) {
    const response = await apiHelper.fetchData(_url(`/${lostFoundId}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status,
        is_completed: isCompleted ? 1 : 0,
      }),
    });
    const result = await parseResponse(response, "Gagal mengubah laporan");
    return result.message;
  }

  // filters: { status: "lost" | "found", is_completed: 1 | 0, is_me: 1 }
  async function getLostFounds(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const query = params.toString();

    const response = await apiHelper.fetchData(_url(query ? `/?${query}` : "/"), {
      method: "GET",
    });
    const result = await parseResponse(response, "Gagal mengambil data laporan");
    const data = result.data ?? {};
    return data.lost_founds ?? data.lostFounds ?? [];
  }

  async function getLostFoundById(lostFoundId) {
    const response = await apiHelper.fetchData(_url(`/${lostFoundId}`), {
      method: "GET",
    });
    const result = await parseResponse(response, "Gagal mengambil detail laporan");
    const data = result.data ?? {};
    return data.lost_found ?? data.lostFound ?? null;
  }

  async function deleteLostFound(lostFoundId) {
    const response = await apiHelper.fetchData(_url(`/${lostFoundId}`), {
      method: "DELETE",
    });
    const result = await parseResponse(response, "Gagal menghapus laporan");
    return result.message;
  }

  async function getStatsDaily() {
    const response = await apiHelper.fetchData(_url("/stats/daily"), { method: "GET" });
    const result = await parseResponse(response, "Gagal mengambil statistik harian");
    return result.data;
  }

  async function getStatsMonthly() {
    const response = await apiHelper.fetchData(_url("/stats/monthly"), { method: "GET" });
    const result = await parseResponse(response, "Gagal mengambil statistik bulanan");
    return result.data;
  }

  return {
    postLostFound,
    postLostFoundCover,
    putLostFound,
    getLostFounds,
    getLostFoundById,
    deleteLostFound,
    getStatsDaily,
    getStatsMonthly,
  };
})();

export default lostFoundApi;