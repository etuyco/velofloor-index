"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function UnsubscribeConfirm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleUnsubscribe() {
    setStatus("loading");
    try {
      const params = new URLSearchParams({ e: email, t: token });
      const res = await fetch(`/api/unsubscribe?${params.toString()}`, {
        method: "POST",
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="animate-fade-in-up">
        <div className="flex justify-center mb-3 text-brand-forest">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-display font-bold text-2xl text-brand-ink mb-3">
          You&apos;ve been unsubscribed
        </h1>
        <p className="text-gray-600 leading-relaxed">
          <span className="font-medium text-brand-ink">{email}</span> has been
          removed from the Velofloor waitlist. You won&apos;t receive any more
          emails from us.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display font-bold text-2xl text-brand-ink mb-3">
        Unsubscribe from Velofloor
      </h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        Stop sending waitlist and launch emails to{" "}
        <span className="font-medium text-brand-ink">{email}</span>?
      </p>

      <button
        onClick={handleUnsubscribe}
        disabled={status === "loading"}
        className="w-full bg-brand-emerald hover:bg-[#16a34a] text-white px-8 py-3 rounded-md font-bold transition-all shadow-sm text-base disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Unsubscribing..." : "Confirm unsubscribe"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600 mt-3">
          Something went wrong. Please try again or reply to one of our emails.
        </p>
      )}
    </>
  );
}
