import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import FormField from "../../../components/FormField";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { showWarningDialog } from "../../../helpers/toolsHelper";
import {
  asyncChangeProfile,
  asyncChangeProfilePassword,
  asyncChangeProfilePhoto,
} from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

export default function ProfilePage() {
  useDocumentTitle("Profil Saya");
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const isChangeProfile = useSelector((state) => state.isChangeProfile);
  const isChangeProfilePhoto = useSelector((state) => state.isChangeProfilePhoto);
  const isChangeProfilePassword = useSelector((state) => state.isChangeProfilePassword);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [infoErrors, setInfoErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!photo) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  async function handleInfoSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!name.trim()) {
      errors.name = "Nama wajib diisi.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Format email tidak valid.";
    }
    setInfoErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    await dispatch(asyncChangeProfile(name.trim(), email.trim()));
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhoto(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      await showWarningDialog("Berkas harus berupa gambar.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      await showWarningDialog("Ukuran foto maksimal 2 MB.");
      event.target.value = "";
      return;
    }
    setPhoto(file);
  }

  async function handlePhotoSubmit(event) {
    event.preventDefault();
    if (!photo) {
      await showWarningDialog("Pilih foto terlebih dahulu.");
      return;
    }
    const ok = await dispatch(asyncChangeProfilePhoto(photo));
    if (ok) {
      setPhoto(null);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    const errors = {};
    if (!password) {
      errors.password = "Kata sandi saat ini wajib diisi.";
    }
    if (newPassword.length < 6) {
      errors.newPassword = "Kata sandi baru minimal 6 karakter.";
    }
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Konfirmasi kata sandi tidak sama.";
    }
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    const ok = await dispatch(asyncChangeProfilePassword(password, newPassword));
    if (ok) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const buttonClass =
    "rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70";
  const cardClass = "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-700">
          Perbarui data akun, foto profil, dan kata sandimu.
        </p>
      </div>

      <section aria-labelledby="profile-info-title" className={cardClass}>
        <h2 id="profile-info-title" className="text-lg font-bold text-slate-900">
          Informasi akun
        </h2>
        <form onSubmit={handleInfoSubmit} noValidate className="mt-4 max-w-lg space-y-4">
          <FormField
            id="profile-name"
            label="Nama lengkap"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={infoErrors.name}
          />
          <FormField
            id="profile-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={infoErrors.email}
          />
          <button type="submit" disabled={isChangeProfile} className={buttonClass}>
            {isChangeProfile ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </form>
      </section>

      <section aria-labelledby="profile-photo-title" className={cardClass}>
        <h2 id="profile-photo-title" className="text-lg font-bold text-slate-900">
          Foto profil
        </h2>
        <form onSubmit={handlePhotoSubmit} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={name} photo={preview || profile?.photo} size="lg" />
          <div className="space-y-3">
            <FormField
              id="profile-photo"
              label="Pilih foto baru"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hint="Format gambar, ukuran maksimal 2 MB."
            />
            <button type="submit" disabled={isChangeProfilePhoto} className={buttonClass}>
              {isChangeProfilePhoto ? "Mengunggah…" : "Unggah foto"}
            </button>
          </div>
        </form>
      </section>

      <section aria-labelledby="profile-password-title" className={cardClass}>
        <h2 id="profile-password-title" className="text-lg font-bold text-slate-900">
          Ubah kata sandi
        </h2>
        <form onSubmit={handlePasswordSubmit} noValidate className="mt-4 max-w-lg space-y-4">
          <FormField
            id="profile-current-password"
            label="Kata sandi saat ini"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordErrors.password}
          />
          <FormField
            id="profile-new-password"
            label="Kata sandi baru"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            error={passwordErrors.newPassword}
          />
          <FormField
            id="profile-confirm-password"
            label="Konfirmasi kata sandi baru"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={passwordErrors.confirmPassword}
          />
          <button type="submit" disabled={isChangeProfilePassword} className={buttonClass}>
            {isChangeProfilePassword ? "Menyimpan…" : "Ubah kata sandi"}
          </button>
        </form>
      </section>
    </div>
  );
}