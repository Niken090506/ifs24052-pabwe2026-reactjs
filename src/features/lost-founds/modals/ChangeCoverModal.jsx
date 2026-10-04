import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormField from "../../../components/FormField";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import { asyncChangeLostFoundCover } from "../states/action";
import ModalShell from "./ModalShell";

const MAX_SIZE = 2 * 1024 * 1024;

export default function ChangeCoverModal({ lostFound, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChangeCover);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleFileChange(event) {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      await showWarningDialog("Berkas harus berupa gambar.");
      event.target.value = "";
      return;
    }
    if (selected.size > MAX_SIZE) {
      await showWarningDialog("Ukuran gambar maksimal 2 MB.");
      event.target.value = "";
      return;
    }
    setFile(selected);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      await showWarningDialog("Pilih gambar terlebih dahulu.");
      return;
    }
    const ok = await dispatch(asyncChangeLostFoundCover(lostFound.id, file));
    if (ok) {
      onSuccess();
      onClose();
    }
  }

  const shown = preview || lostFound.cover;

  return (
    <ModalShell titleId="cover-modal-title" title="Ubah gambar cover" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="cover-file"
          label="Pilih gambar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hint="Format gambar, ukuran maksimal 2 MB."
        />
        {shown ? (
          <img
            src={shown}
            alt={preview ? "Pratinjau gambar yang dipilih" : `Cover saat ini untuk ${lostFound.title}`}
            width={480}
            height={270}
            className="aspect-video w-full rounded-lg bg-slate-100 object-contain"
          />
        ) : (
          <p className="rounded-lg bg-slate-100 p-4 text-center text-sm text-slate-700">
            Belum ada gambar cover.
          </p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-400 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isChanging}
            className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
          >
            {isChanging ? "Mengunggah…" : "Unggah cover"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}