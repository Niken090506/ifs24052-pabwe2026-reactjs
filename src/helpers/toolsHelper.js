// SweetAlert2 dimuat secara dinamis agar tidak membebani muatan awal halaman.
async function loadSwal() {
  const module = await import("sweetalert2");
  return module.default;
}

const CONFIRM_COLOR = "#4338ca";
const DANGER_COLOR = "#b91c1c";

export async function showSuccessDialog(message) {
  const Swal = await loadSwal();
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonText: "Tutup",
    confirmButtonColor: CONFIRM_COLOR,
  });
}

export async function showErrorDialog(message) {
  const Swal = await loadSwal();
  return Swal.fire({
    icon: "error",
    title: "Terjadi Kesalahan",
    text: message,
    confirmButtonText: "Tutup",
    confirmButtonColor: DANGER_COLOR,
  });
}

export async function showWarningDialog(message) {
  const Swal = await loadSwal();
  return Swal.fire({
    icon: "warning",
    title: "Perhatian",
    text: message,
    confirmButtonText: "Mengerti",
    confirmButtonColor: CONFIRM_COLOR,
  });
}

export async function showConfirmDialog(title, text, confirmText = "Ya") {
  const Swal = await loadSwal();
  const result = await Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: DANGER_COLOR,
    cancelButtonColor: "#475569",
  });
  return result.isConfirmed;
}

export function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}