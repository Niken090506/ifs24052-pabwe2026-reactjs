import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import { asyncAddLostFound } from "../states/action";
import ModalShell from "./ModalShell";
import ReportFields, { validateReport } from "./ReportFields";

export default function AddModal({ onClose, onSuccess }) {
  const dispatch = useDispatch();
  const isAdding = useSelector((state) => state.isLostFoundAdd);
  const [title, onTitleChange] = useInput("");
  const [description, onDescriptionChange] = useInput("");
  const [status, setStatus] = useState("lost");
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const validation = validateReport(title, description);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    const ok = await dispatch(asyncAddLostFound(title.trim(), description.trim(), status));
    if (ok) {
      onSuccess();
      onClose();
    }
  }

  return (
    <ModalShell titleId="add-modal-title" title="Tambah laporan" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <ReportFields
          idPrefix="add"
          title={title}
          onTitleChange={onTitleChange}
          description={description}
          onDescriptionChange={onDescriptionChange}
          status={status}
          onStatusChange={(event) => setStatus(event.target.value)}
          errors={errors}
        />
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
            disabled={isAdding}
            className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
          >
            {isAdding ? "Menyimpan…" : "Simpan laporan"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}