import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle("Halaman Tidak Ditemukan");

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-slate-700">
        Alamat yang kamu buka tidak tersedia. Kembali ke beranda untuk melihat laporan terbaru.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}