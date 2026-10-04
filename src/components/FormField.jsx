import clsx from "clsx";

/**
 * Field formulir yang aksesibel: label terhubung ke input,
 * pesan error dibacakan oleh pembaca layar.
 */
export default function FormField({
  id,
  label,
  error,
  hint,
  as: Component = "input",
  className,
  children,
  ...props
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Component
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy || undefined}
        className={clsx(
          "block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm",
          error ? "border-red-600" : "border-slate-400",
          className
        )}
        {...props}
      >
        {children}
      </Component>
      {hint ? (
        <p id={hintId} className="text-xs text-slate-600">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}