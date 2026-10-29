import React from "react";

const paths = {
  cloud: (
    <>
      <path d="M7 18a5 5 0 1 1 1-10 7 7 0 0 1 13 4 4 4 0 0 1-4 6H7Z" />
      <path d="M12 11v3m0 2h.01" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c-9-1-15 3-15 9a6 6 0 0 0 6 6c6 0 10-6 9-15Z" />
      <path d="M4 21 15 10M9 16v-5m0 5h5" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </>
  ),
  back: <path d="m14 6-6 6 6 6" />,
  chat: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5a8.5 8.5 0 0 1 17 0Z" />
      <path d="M8 10h8m-8 4h5" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: <path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z" />,
  trend: (
    <>
      <path d="M3 4v16h18M6 15l5-5 4 2 6-7" />
      <path d="M17 5h4v4" />
    </>
  ),
  heart: <path d="m12 20-8-8a5 5 0 0 1 8-6 5 5 0 0 1 8 6l-8 8Z" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  send: (
    <>
      <path d="m12 19 0-14m-6 6 6-6 6 6" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
    </>
  ),
  phone: (
    <path d="m7 3 3 5-2 2a14 14 0 0 0 6 6l2-2 5 3c0 3-2 5-5 4A20 20 0 0 1 3 8c-1-3 1-5 4-5Z" />
  ),
};

export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.leaf}
    </svg>
  );
}
