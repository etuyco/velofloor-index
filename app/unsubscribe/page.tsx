import { Layers } from "lucide-react";
import { verifyToken, normalizeEmail } from "@/lib/unsubscribe";
import UnsubscribeConfirm from "./UnsubscribeConfirm";

export const metadata = {
  title: "Unsubscribe | Velofloor",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const email = typeof sp.e === "string" ? sp.e : "";
  const token = typeof sp.t === "string" ? sp.t : "";
  const valid = verifyToken(email, token);

  return (
    <main className="flex-grow flex flex-col items-center justify-center py-16 px-6 relative z-10">
      <div className="flex items-center gap-3 text-brand-forest mb-8">
        <div className="w-10 h-10 bg-brand-forest rounded-lg flex items-center justify-center text-white shadow-sm">
          <Layers className="w-6 h-6" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight-display text-brand-ink">
          Velofloor
        </span>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-brand-sand shadow-sm text-center">
        {valid ? (
          <UnsubscribeConfirm
            email={normalizeEmail(email)}
            token={token}
          />
        ) : (
          <>
            <h1 className="font-display font-bold text-2xl text-brand-ink mb-3">
              Invalid unsubscribe link
            </h1>
            <p className="text-gray-600 leading-relaxed">
              This link is invalid or has expired. If you keep receiving emails
              you didn&apos;t sign up for, reply to one of them and we&apos;ll
              remove you right away.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
