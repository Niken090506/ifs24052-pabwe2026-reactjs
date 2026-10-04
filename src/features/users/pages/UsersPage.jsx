import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { asyncSetUsers } from "../states/action";

export default function UsersPage() {
  useDocumentTitle("Pengguna");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    dispatch(asyncSetUsers()).then(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [dispatch]);

  const filtered = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter(
      (user) =>
        String(user.name || "").toLowerCase().includes(query) ||
        String(user.email || "").toLowerCase().includes(query)
    );
  }, [users, keyword]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Daftar Pengguna</h1>
        <p className="mt-1 text-sm text-slate-700">
          Semua pengguna yang terdaftar di aplikasi Lost &amp; Founds.
        </p>
      </div>

      <div className="max-w-md">
        <label htmlFor="user-search" className="mb-1.5 block text-sm font-semibold text-slate-800">
          Cari pengguna
        </label>
        <input
          id="user-search"
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Ketik nama atau email"
          className="block w-full rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-sm placeholder:text-slate-500"
        />
      </div>

      <p role="status" aria-live="polite" className="text-sm text-slate-700">
        {loading ? "Memuat pengguna…" : `${filtered.length} pengguna ditemukan`}
      </p>

      {!loading && filtered.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-700 ring-1 ring-slate-200">
          Tidak ada pengguna yang cocok.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <Avatar name={user.name} photo={user.photo} size="md" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{user.name}</p>
                <p className="truncate text-sm text-slate-700">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}