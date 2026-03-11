import Link from "next/link";

function NailArtLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="9" y="12" width="14" height="16" rx="3" className="fill-primary" />
      <rect x="11.5" y="14" width="3" height="10" rx="1.5" className="fill-primary-foreground/30" />
      <rect x="12" y="6" width="8" height="7" rx="1.5" className="fill-foreground" />
      <rect x="15" y="2" width="2" height="5" rx="1" className="fill-foreground/60" />
      <path d="M26 4l0.8 2.2L29 7l-2.2 0.8L26 10l-0.8-2.2L23 7l2.2-0.8Z" className="fill-orange-400" />
      <path d="M5 8l0.5 1.5L7 10l-1.5 0.5L5 12l-0.5-1.5L3 10l1.5-0.5Z" className="fill-blue-400/70" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Threads",
    href: "https://threads.net",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.10-1.14 3.531-1.205 1.07-.05 2.057.058 2.946.319-.1-.634-.3-1.157-.6-1.565-.44-.595-1.12-.903-2.08-.94h-.036c-.764 0-1.72.248-2.143.768l-1.64-1.28C8.57 5.984 9.93 5.392 11.53 5.392h.05c1.53.06 2.71.614 3.51 1.648.66.855 1.065 1.97 1.22 3.36.47.154.9.34 1.3.56 1.16.643 2.05 1.56 2.57 2.65.84 1.78.91 4.73-1.28 6.88-1.81 1.78-4.06 2.58-7.26 2.6h-.01zM12.834 13.09c-.98.046-1.738.274-2.27.684-.476.369-.7.844-.67 1.413.036.66.406 1.2 1.07 1.558.597.322 1.33.456 2.078.418 1.12-.06 1.96-.462 2.56-1.226.42-.534.72-1.234.87-2.08-.66-.218-1.39-.37-2.19-.41-.47-.025-.95-.016-1.45.044v-.4z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="w-full px-4 pb-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-background/60 px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-row items-start justify-between gap-6">
            {/* Left: Logo + Social (vertical) */}
            <div className="flex flex-col gap-3">
              <a href="/" className="group">
                <NailArtLogo />
              </a>

              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-muted-foreground/60 transition-colors hover:text-foreground"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>

              <p className="text-xs text-muted-foreground/50">
                &copy; 2026 NailArt AI. All rights reserved.
              </p>
            </div>

            {/* Right: Links (vertical) */}
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground/50 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
