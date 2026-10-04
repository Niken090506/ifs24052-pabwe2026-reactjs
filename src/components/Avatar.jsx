import clsx from "clsx";

function getInitials(name) {
  return (
    String(name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

/**
 * Avatar pengguna. Gambar bersifat dekoratif (nama ditampilkan di dekatnya),
 * sehingga alt dikosongkan.
 */
export default function Avatar({ name, photo, size = "md", className }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-24 w-24 text-2xl",
  };
  const pixel = { sm: 32, md: 40, lg: 96 }[size];

  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        width={pixel}
        height={pixel}
        loading="lazy"
        decoding="async"
        className={clsx("rounded-full object-cover bg-slate-200", sizes[size], className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-800",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
}