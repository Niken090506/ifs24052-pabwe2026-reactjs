import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../../../components/FormField";
import useInput from "../../../hooks/useInput";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import {
  asyncSetIsAuthRegister,
  setIsAuthRegisterActionCreator,
} from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(name, email, password, confirmPassword) {
  const errors = {};
  if (!name.trim()) {
    errors.name = "Nama wajib diisi.";
  }
  if (!email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Format email tidak valid.";
  }
  if (password.length < 6) {
    errors.password = "Kata sandi minimal 6 karakter.";
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = "Konfirmasi kata sandi tidak sama.";
  }
  return errors;
}

export default function RegisterPage() {
  useDocumentTitle("Daftar");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthRegister = useSelector((state) => state.isAuthRegister);
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [confirmPassword, onConfirmChange] = useInput("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthRegister) {
      dispatch(setIsAuthRegisterActionCreator(false));
      navigate("/auth/login", { replace: true });
    }
  }, [isAuthRegister, dispatch, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    const validation = validateRegister(name, email, password, confirmPassword);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    setSubmitting(true);
    await dispatch(asyncSetIsAuthRegister(name.trim(), email.trim(), password));
    setSubmitting(false);
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">Buat akun baru</h1>
      <p className="mt-1 text-sm text-slate-700">
        Daftar untuk mulai melaporkan barang hilang dan temuan.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField
          id="register-name"
          label="Nama lengkap"
          name="name"
          autoComplete="name"
          placeholder="Nama lengkap"
          value={name}
          onChange={onNameChange}
          error={errors.name}
        />
        <FormField
          id="register-email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={onEmailChange}
          error={errors.email}
        />
        <FormField
          id="register-password"
          label="Kata sandi"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={onPasswordChange}
          error={errors.password}
        />
        <FormField
          id="register-confirm"
          label="Konfirmasi kata sandi"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Ulangi kata sandi"
          value={confirmPassword}
          onChange={onConfirmChange}
          error={errors.confirmPassword}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
        >
          {submitting ? "Memproses…" : "Daftar"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-700">
        Sudah punya akun?{" "}
        <Link to="/auth/login" className="font-semibold text-indigo-700 underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}