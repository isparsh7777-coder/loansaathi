function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="#14213D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function PersonalLoanIcon() {
  return (
    <Base>
      <circle cx="32" cy="22" r="9" />
      <path d="M14 50c2-10 9-16 18-16s16 6 18 16" />
      <circle cx="32" cy="22" r="9" fill="#F2A93B" fillOpacity="0.15" />
    </Base>
  );
}

export function BusinessLoanIcon() {
  return (
    <Base>
      <rect x="12" y="26" width="40" height="26" rx="2" />
      <path d="M24 26v-6a8 8 0 0 1 16 0v6" />
      <path d="M12 36h40" />
      <rect x="12" y="26" width="40" height="10" fill="#F2A93B" fillOpacity="0.15" />
    </Base>
  );
}

export function HomeLoanIcon() {
  return (
    <Base>
      <path d="M12 30 L32 14 L52 30" />
      <path d="M18 26v24h28V26" />
      <rect x="28" y="36" width="8" height="14" fill="#F2A93B" fillOpacity="0.15" />
      <path d="M28 50V36h8v14" />
    </Base>
  );
}

export function VehicleLoanIcon() {
  return (
    <Base>
      <path d="M10 38 L14 26a4 4 0 0 1 4-3h28a4 4 0 0 1 4 3l4 12" />
      <rect x="8" y="38" width="48" height="10" rx="3" fill="#F2A93B" fillOpacity="0.15" />
      <circle cx="20" cy="48" r="4" />
      <circle cx="44" cy="48" r="4" />
    </Base>
  );
}

export function EducationLoanIcon() {
  return (
    <Base>
      <path d="M32 16 L56 26 L32 36 L8 26 Z" fill="#F2A93B" fillOpacity="0.15" />
      <path d="M18 30v10c0 4 6 8 14 8s14-4 14-8V30" />
      <path d="M56 26v14" />
    </Base>
  );
}

export function InstantLoanIcon() {
  return (
    <Base>
      <path d="M34 8 L14 36h14l-4 20 24-30H34z" fill="#F2A93B" fillOpacity="0.2" />
    </Base>
  );
}
