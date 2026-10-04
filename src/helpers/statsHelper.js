/**
 * Mengubah data statistik dari API menjadi baris tabel sederhana
 * { label, total }. Mendukung bentuk array maupun objek.
 */
export function toStatRows(data) {
  if (!data) {
    return [];
  }

  const list = Array.isArray(data)
    ? data
    : Object.values(data).find((value) => Array.isArray(value));

  if (list) {
    return list.map((item) => ({
      label: String(item.date ?? item.month ?? item.label ?? item.period ?? "-"),
      total: Number(item.total ?? item.count ?? 0),
    }));
  }

  return Object.entries(data)
    .filter(([, value]) => typeof value === "number")
    .map(([label, total]) => ({ label, total }));
}