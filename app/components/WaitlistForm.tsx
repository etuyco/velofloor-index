"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div id="waitlist" className="w-full max-w-xl mx-auto mb-12">
      {status === "success" ? (
        <div className="w-full bg-green-50 border border-green-200 text-brand-forest p-4 rounded-lg text-center font-medium animate-fade-in-up">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>You&apos;re on the list. Keep an eye on your inbox.</span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full bg-white p-2 rounded-lg border border-brand-sand shadow-lg"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            placeholder="Enter your work email address"
            className="flex-1 px-4 py-3 bg-transparent text-brand-ink placeholder-gray-400 focus:outline-none text-base disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-brand-emerald hover:bg-[#16a34a] text-white px-8 py-3 rounded-md font-bold transition-all shadow-sm text-base whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Securing..." : "Secure Your Spot"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600 mt-2 text-center font-medium">
          {error}
        </p>
      )}

      <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5 font-mono tracking-wide-mono uppercase">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" /> Lock in
        lifetime early-adopter pricing.
      </p>
    </div>
  );
}
