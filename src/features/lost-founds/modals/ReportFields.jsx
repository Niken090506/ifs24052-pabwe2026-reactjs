import FormField from "../../../components/FormField";

/**
 * Kolom form yang dipakai bersama oleh AddModal dan ChangeModal.
 */
export default function ReportFields({
  idPrefix,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  status,
  onStatusChange,
  errors,
}) {
  return (
    <>
      <FormField
        id={`${idPrefix}-title`}
        label="Judul laporan"
        value={title}
        onChange={onTitleChange}
        placeholder="Contoh: Dompet cokelat"
        error={errors.title}
      />
      <FormField
        id={`${idPrefix}-description`}
        label="Deskripsi"
        as="textarea"
        rows={4}
        value={description}
        onChange={onDescriptionChange}
        placeholder="Ciri-ciri barang, lokasi, dan waktu kejadian"
        error={errors.description}
      />
      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-slate-800">Jenis laporan</legend>
        <div className="flex gap-6">
          {[
            ["lost", "Barang hilang"],
            ["found", "Barang ditemukan"],
          ].map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="radio"
                name={`${idPrefix}-status`}
                value={value}
                checked={status === value}
                onChange={onStatusChange}
                className="h-4 w-4 accent-indigo-700"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export function validateReport(title, description) {
  const errors = {};
  if (!title.trim()) {
    errors.title = "Judul wajib diisi.";
  }
  if (!description.trim()) {
    errors.description = "Deskripsi wajib diisi.";
  }
  return errors;
}