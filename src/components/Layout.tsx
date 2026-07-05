import { Outlet } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10 md:py-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.3 2 1.6 3.5 3.5 3.8v2.4c-1.3 0-2.5-.4-3.5-1v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.5a3.1 3.1 0 1 0 2.2 3V3h2.5Z" />
    </svg>
  );
}

const socials = [
  { label: "Facebook", Icon: Facebook, href: "#" },
  { label: "Instagram", Icon: Instagram, href: "#" },
  { label: "LinkedIn", Icon: Linkedin, href: "#" },
  { label: "TikTok", Icon: TikTok, href: "#" },
];

function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white px-5 py-16 md:py-20">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-[22px]">
          <div className="flex items-center gap-[15px]">
            <img src="/figma/logo.png" alt="Booky" className="size-[42px]" />
            <span className="text-[32px] font-bold tracking-tight text-[var(--color-ink)]">
              Booky
            </span>
          </div>
          <p className="max-w-xl text-center text-base font-semibold tracking-[-0.32px] text-[var(--color-ink)]">
            Discover inspiring stories &amp; timeless knowledge, ready to borrow anytime.
            Explore online or visit our nearest library branch.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <p className="text-base font-bold text-[var(--color-ink)]">Follow on Social Media</p>
          <div className="flex items-center gap-3">
            {socials.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink)] transition-colors hover:bg-secondary"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
