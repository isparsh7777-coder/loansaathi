"use client";

export default function LiveChatButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // @ts-expect-error Tawk_API is injected by the script tag in help/page.tsx
        if (typeof window !== "undefined" && window.Tawk_API?.toggle) {
          // @ts-expect-error see above
          window.Tawk_API.toggle();
        }
      }}
      className="card w-full text-center"
    >
      <p className="font-semibold text-ink">Live Support</p>
    </button>
  );
}
