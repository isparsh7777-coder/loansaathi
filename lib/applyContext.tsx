"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { LoanType, EmploymentType } from "@/lib/types";

export interface ApplyDraft {
  mobile: string | null;
  loanType: LoanType | null;
  firstName: string;
  surname: string;
  dob: string;
  pan: string;
  aadhaar: string;
  houseNo: string;
  area: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  employmentType: EmploymentType | null;
  monthlyIncome: number | null;
  amount: number;
  tenureYears: number | null;
  purpose: string;
  cibilScore: number | null;
  creditConsent: boolean;
  applicationId: string | null; // set once the application is actually created
}

const emptyDraft: ApplyDraft = {
  mobile: null,
  loanType: null,
  firstName: "",
  surname: "",
  dob: "",
  pan: "",
  aadhaar: "",
  houseNo: "",
  area: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pincode: "",
  employmentType: null,
  monthlyIncome: null,
  amount: 400000,
  tenureYears: null,
  purpose: "",
  cibilScore: null,
  creditConsent: false,
  applicationId: null,
};

interface ApplyContextValue {
  draft: ApplyDraft;
  update: (patch: Partial<ApplyDraft>) => void;
}

const ApplyContext = createContext<ApplyContextValue | null>(null);

export function ApplyProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ApplyDraft>(emptyDraft);
  const update = (patch: Partial<ApplyDraft>) => setDraft((d) => ({ ...d, ...patch }));
  return <ApplyContext.Provider value={{ draft, update }}>{children}</ApplyContext.Provider>;
}

export function useApplyDraft() {
  const ctx = useContext(ApplyContext);
  if (!ctx) throw new Error("useApplyDraft must be used within ApplyProvider");
  return ctx;
}

/** Fee tier matching what's shown on the payment step. */
export function feeForAmount(amount: number): number {
  if (amount <= 500000) return 99;
  if (amount <= 1000000) return 199;
  return 499;
}
