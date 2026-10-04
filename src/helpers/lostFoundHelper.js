export const STATUS_LABEL = {
  lost: "Hilang",
  found: "Ditemukan",
};

export function isCompleted(item) {
  return Boolean(Number(item?.is_completed));
}

export function getReporterName(item) {
  return item?.user?.name ?? item?.author?.name ?? item?.user_name ?? "Pengguna";
}

// Bila pemilik laporan tidak diketahui dari API, aksi tetap ditampilkan
// dan server yang memutuskan hak akses.
export function isOwnedBy(item, profile) {
  const ownerId = item?.user_id ?? item?.user?.id;
  if (ownerId === undefined || ownerId === null) {
    return true;
  }
  return ownerId === profile?.id;
}

export function countMetrics(items) {
  return {
    total: items.length,
    lost: items.filter((item) => item.status === "lost").length,
    found: items.filter((item) => item.status === "found").length,
    completed: items.filter((item) => isCompleted(item)).length,
  };
}