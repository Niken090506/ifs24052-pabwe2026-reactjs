import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncChangeLostFound } from "../states/action";
import { isCompleted } from "../../../helpers/lostFoundHelper";
import ModalShell from "./ModalShell";
import ReportFields, { validateReport } from "./ReportFields";

export default function ChangeModal({ lostFound, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const isChanging = useSelector((state) => state.isLostFoundChange);
  const [title, setTitle] = useState(lostFound.title || "");
  const [description, setDescription] = useState(lostFound.description || "");
  const [status, setStatus] = useState(lostFound.status === "found" ? "found" : "lost");
  const [completed, setCompleted] = useState(isCompleted(lostFound));
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    const validation = validateReport(title, description);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    const ok = await dispatch(
      asyncChangeLostFound(lostFound.id, title.trim(), description.trim(), status, completed)
    );
    if (ok) {
      onSuccess();
      onClose();
    }
  }

  return (
    <ModalShell titleId="change-modal-title" title="Ubah laporan" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <ReportFields
          idPrefix="change"
          title={title}
          onTitleChange={(event) => setTitle(event.target.value)}
          description={description}
          onDescriptionChange={(event) => setDescription(event.target.value)}
          status={status}
          onStatusChange={(event) => setStatus(event.target.value)}
          errors={errors}
        />
        <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => setCompleted(event.target.checked)}
            className="h-4 w-4 accent-indigo-700"
          />
          Tandai laporan ini sudah selesai
        </label>
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
            {isChanging ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}