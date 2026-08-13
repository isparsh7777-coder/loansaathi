"use client";

import { useState } from "react";
import StepProgress from "@/components/StepProgress";
import { TransitionOverlay, useStepNavigate } from "@/components/StepTransition";
import { useApplyDraft } from "@/lib/applyContext";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

function formatAadhaar(digits: string) {
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

export default function PersonalDetailsStep() {
  const { draft, update } = useApplyDraft();
  const { navigate, transitioning, message } = useStepNavigate("Saving your details…");

  const [firstName, setFirstName] = useState(draft.firstName);
  const [surname, setSurname] = useState(draft.surname);
  const [dob, setDob] = useState(draft.dob);
  const [pan, setPan] = useState(draft.pan);
  const [aadhaar, setAadhaar] = useState(draft.aadhaar);
  const [houseNo, setHouseNo] = useState(draft.houseNo);
  const [area, setArea] = useState(draft.area);
  const [addressLine1, setAddressLine1] = useState(draft.addressLine1);
  const [addressLine2, setAddressLine2] = useState(draft.addressLine2);
  const [city, setCity] = useState(draft.city);
  const [pincode, setPincode] = useState(draft.pincode);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};

    if (firstName.trim().length < 3 || firstName.trim().length > 10) {
      e.firstName = "Name must be 3–10 letters";
    } else if (!/^[A-Za-z\s]+$/.test(firstName.trim())) {
      e.firstName = "Name can only contain letters";
    }

    if (surname.trim() && !/^[A-Za-z\s]{1,15}$/.test(surname.trim())) {
      e.surname = "Surname can only contain letters (max 15)";
    }

    if (!dob) e.dob = "Date of birth is required";

    if (!PAN_REGEX.test(pan.trim().toUpperCase())) {
      e.pan = "Enter a valid PAN, e.g. ABCDE1234F";
    }

    const aadhaarDigits = aadhaar.replace(/\s/g, "");
    if (!/^\d{12}$/.test(aadhaarDigits)) {
      e.aadhaar = "Aadhaar must be exactly 12 digits";
    }

    if (!houseNo.trim() || !/^\d+[A-Za-z]?$/.test(houseNo.trim())) {
      e.houseNo = "Enter a valid house/flat number";
    }
    if (!area.trim()) e.area = "Area/Colony is required";
    if (!addressLine1.trim()) e.addressLine1 = "Address line is required";
    if (!city.trim() || !/^[A-Za-z\s]+$/.test(city.trim())) {
      e.city = "Enter a valid city name";
    }
    if (!PINCODE_REGEX.test(pincode.trim())) {
      e.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    update({
      firstName: firstName.trim(),
      surname: surname.trim(),
      dob,
      pan: pan.trim().toUpperCase(),
      aadhaar: aadhaar.replace(/\s/g, ""),
      houseNo: houseNo.trim(),
      area: area.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    });
    navigate("/apply/employment");
  }

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      {transitioning && <TransitionOverlay message={message} />}
      <StepProgress current={3} />
      <h1 className="mb-2">Tell Us About Yourself</h1>
      <p className="mb-6 text-sm text-ink-500">Just the basics — you can add more detail later.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Name" required error={errors.firstName}>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={10}
            className={inputClass(!!errors.firstName)}
          />
        </Field>

        <Field label="Surname" error={errors.surname}>
          <input
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            maxLength={15}
            className={inputClass(!!errors.surname)}
          />
        </Field>

        <Field label="Date of Birth" required error={errors.dob}>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={inputClass(!!errors.dob)}
          />
        </Field>

        <Field label="PAN Number" required error={errors.pan} hint="e.g. ABCDE1234F">
          <input
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
            placeholder="ABCDE1234F"
            className={`${inputClass(!!errors.pan)} uppercase`}
          />
        </Field>

        <Field label="Aadhaar Number" required error={errors.aadhaar} hint="12 digits">
          <input
            inputMode="numeric"
            value={aadhaar}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
              setAadhaar(formatAadhaar(digits));
            }}
            placeholder="XXXX XXXX XXXX"
            className={inputClass(!!errors.aadhaar)}
          />
        </Field>

        <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Address</p>

        <Field label="House / Flat Number" required error={errors.houseNo}>
          <input value={houseNo} onChange={(e) => setHouseNo(e.target.value)} className={inputClass(!!errors.houseNo)} />
        </Field>
        <Field label="Area / Colony" required error={errors.area}>
          <input value={area} onChange={(e) => setArea(e.target.value)} className={inputClass(!!errors.area)} />
        </Field>
        <Field label="Address Line 1" required error={errors.addressLine1}>
          <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className={inputClass(!!errors.addressLine1)} />
        </Field>
        <Field label="Address Line 2">
          <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className={inputClass(false)} />
        </Field>
        <Field label="City" required error={errors.city}>
          <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass(!!errors.city)} />
        </Field>
        <Field label="Pincode" required error={errors.pincode}>
          <input
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            className={inputClass(!!errors.pincode)}
          />
        </Field>

        <button type="submit" className="btn-primary">CONTINUE</button>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-card border bg-white px-4 py-3 outline-none ${
    hasError ? "border-caution" : "border-line"
  }`;
}

function Field({
  label, required, error, hint, children,
}: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">
        {label}{required && <span className="text-caution">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-ink-500">({hint})</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-caution">{error}</span>}
    </label>
  );
}
