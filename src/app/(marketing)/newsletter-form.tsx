"use client";

import { useState } from "react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^.+@.+\..+$/.test(email)) {
          toast.error("Please enter a valid email");
          return;
        }
        setPending(true);
        // No backend yet — confirm intent and clear field. Wire to a mailing
        // service (Resend / Loops / Mailchimp) when product comms ship.
        setTimeout(() => {
          toast.success("Thanks — we'll keep you posted.");
          setEmail("");
          setPending(false);
        }, 400);
      }}
      className="flex flex-col sm:flex-row gap-2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="bg-[#1A1A1A] border border-white/10 rounded-md px-4 py-3 text-sm w-full focus:outline-none focus:border-orange-500 text-white placeholder:text-zinc-600"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 px-6 py-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
      >
        {pending ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
