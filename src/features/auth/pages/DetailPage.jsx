import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft, IconEdit, IconPhoto, IconTrash } from "@tabler/icons-react";
import clsx from "clsx";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import {
  STATUS_LABEL,
  getReporterName,
  isCompleted,
  isOwnedBy,
} from "../../../helpers/lostFoundHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncDeleteLostFound,
  asyncSetLostFound,
  setLostFoundActionCreator,
} from "../states/action";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lostFound = useSelector((state) => state.lostFound);
  const isLoading = useSelector((state) => state.isLostFound);
  const profile = useSelector((state) => state.profile);
  const [modal, setModal] = useState(null);

  useDocumentTitle(lostFound?.title ?? "Detail Laporan");

  useEffect(() => {
    dispatch(asyncSetLostFound(id));
    return () => {
      dispatch(setLostFoundActionCreator(null));
    };
  }, [dispatch, id]);

  function reload() {
    dispatch(asyncSetLostFound(id));
  }

  async function handleDelete() {
    const confirmed = await showConfirmDialog(
      "Hapus laporan?",
      "Laporan yang dihapus tidak dapat dikembalikan.",
      "Ya, hapus"
    );
    if (!confirmed) {
      return;
    }
    const ok = await dispatch(asyncDeleteLostFound(id));
    if (ok) {
      navigate("/", { replace: true });
    }
  }

  const backLink = (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-800 hover:underline"
    >
      <IconArrowLeft size={18} aria-hidden="true" />
      Kembali ke daftar laporan
    </Link>
  );

  if (isLoading && !lostFound) {
    return (
      <div role="status" aria-live="polite" className="p-6 text-sm text-slate-700">
        Memuat detail laporan…
      </div>
    );
  }

  if (!lostFound) {
    return (
      <div className="space-y-4">
        {backLink}
        <h1 className="text-2xl font-bold text-slate-900">Laporan tidak ditemukan</h1>
        <p className="text-slate-700">Laporan yang kamu cari mungkin sudah dihapus.</p>
      </div>
    );
  }

  const owner = isOwnedBy(lostFound, profile);
  const actionClass =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ring-1";

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {backLink}

      {lostFound.cover ? (
        <img
          src={lostFound.cover}
          alt={`Foto ${lostFound.title}`}
          width={768}
          height={432}
          decoding="async"
          className="max-h-[28rem] w-full rounded-2xl bg-slate-100 object-contain"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-700"
        >
          Tanpa gambar
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-sm font-semibold",
            lostFound.status === "found" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
          )}
        >
          {STATUS_LABEL[lostFound.status] ?? lostFound.status}
        </span>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-sm font-semibold",
            isCompleted(lostFound) ? "bg-indigo-100 text-indigo-900" : "bg-amber-100 text-amber-900"
          )}
        >
          {isCompleted(lostFound) ? "Selesai" : "Belum selesai"}
        </span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900">{lostFound.title}</h1>

      <dl className="grid gap-4 rounded-xl bg-white p-4 ring-1 ring-slate-200 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-700">Pelapor</dt>
          <dd className="font-semibold text-slate-900">{getReporterName(lostFound)}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-700">Tanggal lapor</dt>
          <dd className="font-semibold text-slate-900">{formatDate(lostFound.created_at)}</dd>
        </div>
      </dl>

      <section aria-labelledby="deskripsi-title">
        <h2 id="deskripsi-title" className="text-lg font-bold text-slate-900">Deskripsi</h2>
        <p className="mt-2 whitespace-pre-line text-slate-800">{lostFound.description}</p>
      </section>

      {owner ? (
        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => setModal("cover")}
            className={clsx(actionClass, "bg-white text-slate-800 ring-slate-400 hover:bg-slate-100")}
          >
            <IconPhoto size={18} aria-hidden="true" />
            Ubah cover
          </button>
          <button
            type="button"
            onClick={() => setModal("change")}
            className={clsx(actionClass, "bg-indigo-700 text-white ring-indigo-700 hover:bg-indigo-800")}
          >
            <IconEdit size={18} aria-hidden="true" />
            Ubah laporan
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={clsx(actionClass, "bg-red-700 text-white ring-red-700 hover:bg-red-800")}
          >
            <IconTrash size={18} aria-hidden="true" />
            Hapus laporan
          </button>
        </div>
      ) : null}

      {modal === "cover" ? (
        <ChangeCoverModal lostFound={lostFound} onClose={() => setModal(null)} onSuccess={reload} />
      ) : null}
      {modal === "change" ? (
        <ChangeModal lostFound={lostFound} onClose={() => setModal(null)} onSuccess={reload} />
      ) : null}
    </article>
  );
}