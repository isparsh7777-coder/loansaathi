export default function SuccessCheck({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      className="mx-auto"
      role="img"
      aria-label="Verified"
    >
      <circle
        cx="26" cy="26" r="24" fill="none"
        stroke="#1B7A4D" strokeWidth="3"
        strokeDasharray="151"
        style={{ animation: "ls-circle 0.5s ease-out forwards" }}
      />
      <path
        fill="none" stroke="#1B7A4D" strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round"
        d="M14 27 L22 35 L38 17"
        strokeDasharray="40"
        style={{ animation: "ls-check 0.35s 0.4s ease-out forwards" }}
      />
      <style>{`
        circle, path { stroke-dashoffset: 151; opacity: 0; }
        path { stroke-dashoffset: 40; }
        @keyframes ls-circle { to { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes ls-check { to { stroke-dashoffset: 0; opacity: 1; } }
      `}</style>
    </svg>
  );
}
