import { Navigate, Outlet } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import apiHelper from "../../../helpers/apiHelper";

export default function AuthLayout() {
  if (apiHelper.getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div
        aria-hidden="true"
        className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 to-indigo-900 p-12 text-white lg:flex"
      >
        <div className="flex items-center gap-3 text-xl font-bold">
          <IconSearch size={28} stroke={2.5} />
          Lost &amp; Founds
        </div>
        <div className="space-y-4">
          <p className="text-4xl font-bold leading-tight">
            Temukan kembali barangmu, bantu orang lain menemukan miliknya.
          </p>
          <p className="text-lg text-indigo-100">
            Laporkan kehilangan, catat barang temuan, dan pantau penyelesaiannya dalam satu tempat.
          </p>
        </div>
        <p className="text-sm text-indigo-100">Praktikum PABWE 2026</p>
      </div>
      <main id="main-content" className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}