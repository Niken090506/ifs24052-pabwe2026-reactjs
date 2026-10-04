import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import clsx from "clsx";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { formatDate } from "../../../helpers/toolsHelper";
import { toStatRows } from "../../../helpers/statsHelper";
import {
  STATUS_LABEL,
  countMetrics,
  getReporterName,
  isCompleted,
} from "../../../helpers/lostFoundHelper";
import AddModal from "../modals/AddModal";
import { asyncSetLostFoundStats, asyncSetLostFounds } from "../states/action";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "lost", label: "Hilang" },
  { value: "found", label: "Ditemukan" },
];

function StatTable({ caption, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <caption className="px-4 pt-4 text-left font-semibold text-slate-900">{caption}</caption>
        <thead>
          <tr className="text-slate-700">
            <th scope="col" className="px-4 py-2 font-semibold">Periode</th>
            <th scope="col" className="px-4 py-2 font-semibold">Jumlah laporan</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-4 py-3 text-slate-700">Belum ada data.</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.label} className="border-t border-slate-200">
                <th scope="row" className="px-4 py-2 font-medium text-slate-900">{row.label}</th>
                <td className="px-4 py-2 text-slate-800">{row.total}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function HomePage() {
  useDocumentTitle("Laporan");
  const dispatch = useDispatch();
  const location = useLocation();
  const lostFounds = useSelector((state) => state.lostFounds);
  const isLoading = useSelector((state) => state.isLostFound);
  const stats = useSelector((state) => state.lostFoundStats);

  const [status, setStatus] = useState("");
  const [completion, setCompletion] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    dispatch(asyncSetLostFounds(onlyMine ? { is_me: 1 } : {}));
  }, [dispatch, onlyMine]);

  useEffect(() => {
    dispatch(asyncSetLostFoundStats());
  }, [dispatch]);

  useEffect(() => {
    if (location.hash === "#statistik") {
      document.getElementById("statistik")?.scrollIntoView?.();
    }
  }, [location.hash]);

  const metrics = useMemo(() => countMetrics(lostFounds), [lostFounds]);

  const visible = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return lostFounds.filter((item) => {
      if (status && item.status !== status) {
        return false;
      }
      if (completion === "done" && !isCompleted(item)) {
        return false;
      }
      if (completion === "open" && isCompleted(item)) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        String(item.title || "").toLowerCase().includes(query) ||
        String(item.description || "").toLowerCase().includes(query)
      );
    });
  }, [lostFounds, status, completion, keyword]);

  const metricCards = [
    { label: "Total laporan", value: metrics.total },
    { label: "Barang hilang", value: metrics.lost },
    { label: "Barang ditemukan", value: metrics.found },
    { label: "Selesai", value: metrics.completed },
  ];

  function refresh() {
    dispatch(asyncSetLostFounds(onlyMine ? { is_me: 1 } : {}));
    dispatch(asyncSetLostFoundStats());
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Barang Hilang &amp; Temuan</h1>
          <p className="mt-1 text-sm text-slate-700">
            Pantau laporan terbaru dan tandai yang sudah selesai.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          <IconPlus size={18} aria-hidden="true" />
          Tambah laporan
        </button>
      </div>

      <section aria-labelledby="ringkasan-title">
        <h2 id="ringkasan-title" className="sr-only">Ringkasan laporan</h2>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metricCards.map((card) => (
            <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <dt className="text-sm font-medium text-slate-700">{card.label}</dt>
              <dd className="mt-1 text-3xl font-bold text-slate-900">{card.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="daftar-title" className="space-y-4">
        <h2 id="daftar-title" className="text-xl font-bold text-slate-900">Daftar laporan</h2>

        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-60 flex-1">
            <label htmlFor="report-search" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Cari laporan
            </label>
            <input
              id="report-search"
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Ketik judul atau deskripsi"
              className="block w-full rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-sm placeholder:text-slate-500"
            />
          </div>

          <div role="group" aria-label="Filter jenis laporan" className="flex gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={status === filter.value}
                onClick={() => setStatus(filter.value)}
                className={clsx(
                  "rounded-lg px-4 py-2.5 text-sm font-semibold ring-1",
                  status === filter.value
                    ? "bg-indigo-700 text-white ring-indigo-700"
                    : "bg-white text-slate-800 ring-slate-400 hover:bg-slate-100"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="report-completion" className="mb-1.5 block text-sm font-semibold text-slate-800">
              Status penyelesaian
            </label>
            <select
              id="report-completion"
              value={completion}
              onChange={(event) => setCompletion(event.target.value)}
              className="rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">Semua</option>
              <option value="open">Belum selesai</option>
              <option value="done">Selesai</option>
            </select>
          </div>

          <label className="flex items-center gap-2 pb-2.5 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(event) => setOnlyMine(event.target.checked)}
              className="h-4 w-4 accent-indigo-700"
            />
            Laporan saya saja
          </label>
        </div>

        <p role="status" aria-live="polite" className="text-sm text-slate-700">
          {isLoading ? "Memuat laporan…" : `${visible.length} laporan ditampilkan`}
        </p>

        {!isLoading && visible.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-slate-700 ring-1 ring-slate-200">
            Belum ada laporan yang cocok dengan filter ini.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <li
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={`Foto ${item.title}`}
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full bg-slate-100 object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex aspect-video w-full items-center justify-center bg-slate-100 text-sm text-slate-700"
                  >
                    Tanpa gambar
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={clsx(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        item.status === "found"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-red-100 text-red-900"
                      )}
                    >
                      {STATUS_LABEL[item.status] ?? item.status}
                    </span>
                    {isCompleted(item) ? (
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-900">
                        Selesai
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    <Link to={`/lost-founds/${item.id}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="line-clamp-2 text-sm text-slate-700">{item.description}</p>
                  <p className="mt-auto text-xs text-slate-700">
                    {getReporterName(item)} • {formatDate(item.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="statistik" aria-labelledby="statistik-title" className="scroll-mt-24 space-y-4">
        <h2 id="statistik-title" className="text-xl font-bold text-slate-900">Statistik</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <StatTable caption="Statistik harian" rows={toStatRows(stats?.daily)} />
          <StatTable caption="Statistik bulanan" rows={toStatRows(stats?.monthly)} />
        </div>
      </section>

      {showAdd ? <AddModal onClose={() => setShowAdd(false)} onSuccess={refresh} /> : null}
    </div>
  );
}